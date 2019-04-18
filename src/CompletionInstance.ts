import * as vscode from "vscode";
import { DataProvider } from "./DataProvider";

import { HANDLE_COMPLETION } from './extension';
import { flatten, AUDebug } from './util';
import { DocumentWalker, CompletionType } from "./DocumentWalker";
import { SORT_CHEAT, primitives } from "./Constants";
import { getStoredCompletions } from "./CompletionProvider";
import { debug } from "util";
import { Benchmarker } from "./Benchmarker";
import { binSearch, binarySearch } from "./speedutil";


export async function provideCompletionItems(document: vscode.TextDocument, position: vscode.Position,
	token: vscode.CancellationToken, context: vscode.CompletionContext, extensionContext: vscode.ExtensionContext): Promise<vscode.CompletionItem[]> {
	let completionInstance = new CompletionInstance(extensionContext, new DocumentWalker(document));
	return completionInstance.provideCompletionItems(document, position, token, context);
}


class CompletionInstance {

	private data = new DataProvider();

	constructor(
		private context: vscode.ExtensionContext,
		private documentWalker: DocumentWalker) { }



	public async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position,
		token: vscode.CancellationToken, context: vscode.CompletionContext): Promise<vscode.CompletionItem[]> {
		let completionType = await this.documentWalker.getCompletionType(position);

		let completions: vscode.CompletionItem[];

		if (completionType === CompletionType.NONE) {
			completions = [];
		} else {
			let usings = await this.documentWalker.getUsings();
			let completionData: Reference[];

			if (completionType === CompletionType.EXTENSION) {

				let methodCallerHover = await this.documentWalker.getMethodCallerHoverString(position);
				if (methodCallerHover !== undefined) {
					let methodCallerType = this.parseType(methodCallerHover);
					completionData = this.getExtensionMethods(methodCallerType);

				} else {
					AUDebug("Could not find method caller type! Assuming it's just a non-existent type followed by a dot.");
					completionData = [];
				}

			} else if (completionType === CompletionType.REFERENCE) {
				completionData = await this.documentWalker.filterByTypedWord(position, this.data.getReferences());
			}

			completions = this.completionDataToCompletions(completionData!, usings);
		}

		return completions!;
	}




	/** 
	 * Takes a omnisharp hover string from when you hover over a type, and returns the type that is written in it.
	 */
	private parseType(hoverString: string): Type {
		const start = 10;
		let typeStart = hoverString.substring(start, hoverString.length);

		let generic = false;
		let i: number;
		for (i = 0; typeStart[i] !== " " && typeStart[i] !== "\n"; i++) {
			if (typeStart[i] === "<") {
				generic = true;
				break;
			}
		}

		let type = typeStart.substr(0, i);

		let typeClass: string, typeNamespace: string | undefined;

		// If it is a full path return the class and namespace
		if (type.includes(".")) {
			let classAndNamespace = type.split(".");
			typeNamespace = classAndNamespace.slice(0, classAndNamespace.length - 1).join(".");
			typeClass = classAndNamespace.slice(classAndNamespace.length - 1, classAndNamespace.length).join(".");
			// If it is just a class name return just the class
		} else {
			typeClass = type;
			typeNamespace = undefined;
		}

		// Is an array type
		if (typeClass[typeClass.length - 1] === "]") typeClass = "Array";

		// Convert primitives to objects. I.E. string => String.
		//@ts-ignore
		let typeAsObject: string = primitives[typeClass];
		if (typeof typeAsObject !== "undefined") typeClass = typeAsObject;


		if (generic) typeClass += "<>";

		return { class: typeClass, namespace: typeNamespace };
	}

	/**
	 * Get all extension methods of a type
	 */
	private getExtensionMethods(callerType: Type): Reference[] {
		let classPos = binSearch(this.data.getHierachies(), callerType.class, ((h1, h2) => h1.localeCompare(h2.class)));
		if (classPos === - 1) return [];

		let extensibleClasses = this.data.getHierachies()[classPos];

		if (extensibleClasses.namespaces.length === 1) {
			let baseclasses = extensibleClasses.namespaces[0].fathers;
			// Add the class itself to the list of classes that we will get extension methods for.
			let classItselfStr = extensibleClasses.namespaces[0].namespace + "." + callerType.class;
			// Remove generic marker '<>'
			if (classItselfStr[classItselfStr.length - 1] === ">") classItselfStr = classItselfStr.substr(0, classItselfStr.length - 2);
			baseclasses.push(classItselfStr);

			let extensions = flatten(
				baseclasses.map(baseclass =>
					this.data.getExtensionMethods()[binSearch(this.data.getExtensionMethods(), baseclass, (str, ext) => str.localeCompare(ext.extendedClass))])
					.filter(obj => typeof obj !== "undefined")
					.map(extendedClass => extendedClass.extensionMethods));


			return extensions;

		} else {
			throw new Error("Auto Using does not support ambigous references yet.");
		}
	}

	/**
	 * Map pure completion data to vscode's CompletionItem[] format
	 * @param usings A list of the using directive in the file. All already imported references will be removed from the array.
	 */
	private completionDataToCompletions(references: Reference[], usings: string[]): vscode.CompletionItem[] {
		let completionAmount = filterOutAlreadyUsing(references, usings);

		// All references the user has imported before. They will gain a higher priority. 
		let commonNames = getStoredCompletions(this.context).map(completion => completion.label);
		commonNames.sort();

		let completions = new Array<vscode.CompletionItem>(completionAmount);
		let usingPos = this.documentWalker.getUsingPosition();

		for (let i = 0; i < completionAmount; i++) {

			let reference = references[i];
			let name = reference.name;
			let isCommon = binarySearch(commonNames, name) !== -1;

			let thereIsOnlyOneClassWithThatName = reference.namespaces.length === 1;

			// We instantly put the using statement only if there is only one option
			let usingStatementEdit = thereIsOnlyOneClassWithThatName ? [usingEdit(reference.namespaces[0], usingPos)] : undefined;

			let completion: vscode.CompletionItem = {
				label: isCommon ? name : SORT_CHEAT + name,
				insertText: name,
				filterText: name,
				kind: vscode.CompletionItemKind.Reference,
				additionalTextEdits: usingStatementEdit,
				commitCharacters: ["."],
				detail: reference.namespaces.join("\n"),
				command: { command: HANDLE_COMPLETION, arguments: [reference,usingPos.line], title: "handles completion" }
			};

			completions[i] = completion;
		}

		return completions;
	}


}


const usingEdit = (namespace: string, pos: vscode.Position) => vscode.TextEdit.insert(pos, `using ${namespace};\n`);


/**
 * Removes all namespaces that already have a using statement
 */
function filterOutAlreadyUsing(references: Reference[], usings: string[]): number {
	usings.sort();

	let n = references.length;

	for (let i = 0; i < n; i++) {

		let m = references[i].namespaces.length;
		for (let j = 0; j < m; j++) {
			// Get rid of references that their usings exist
			if (binarySearch<string>(usings, references[i].namespaces[j]) !== -1) {
				references[i].namespaces[j] = references[i].namespaces[m - 1];
				references[i].namespaces.length -= 1;
				j--;
				m--;
			}
		}

		// Get rid of empty references
		if (references[i].namespaces.length === 0) {
			references[i] = references[n - 1];
			references.length -= 1;
			i--;
			n--;
		}
	}

	return n;

}


