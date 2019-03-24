import * as vscode from "vscode";
import { DataProvider } from "./DataProvider";

import { HANDLE_COMPLETION } from './extension';
import { flatten, AUDebug, getProjectRootDirOfFilePath, getFullPathToProjectOfFile, getProjectName } from './util';
import { DocumentWalker, CompletionType } from "./DocumentWalker";
import { SORT_CHEAT, primitives } from "./Constants";
import { getStoredCompletions } from "./CompletionProvider";
import { debug } from "util";
import { Benchmarker } from "./Benchmarker";
import { binSearch, binarySearch } from "./speedutil";
import { AutoUsingServer } from "./server/AutoUsingServer";


export async function provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken,
	context: vscode.CompletionContext, extensionContext: vscode.ExtensionContext, server: AutoUsingServer): Promise<vscode.CompletionItem[]> {
	let documentWalker = new DocumentWalker(document);
	let completionInstance = new CompletionInstance(extensionContext, documentWalker, server,
		getProjectName(document.fileName), documentWalker.getWordToComplete(position));
	return completionInstance.provideCompletionItems(document, position, token, context);
}


class CompletionInstance {

	private data = new DataProvider();

	constructor(
		private context: vscode.ExtensionContext,
		private documentWalker: DocumentWalker,
		private server: AutoUsingServer,
		private projectName: string,
		private wordToComplete: string

	) { }



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
					completionData = await this.getExtensionMethods(methodCallerType);

				} else {
					AUDebug("Could not find method caller type! Assuming it's just a non-existent type followed by a dot.");
					completionData = [];
				}

			} else if (completionType === CompletionType.REFERENCE) {
				// let wordToComplete = this.documentWalker.getWordToComplete(position);
				// completionData = await this.documentWalker.filterByTypedWord(position, await this.server.getAllReferences());

				// const projectPath = "C:\\Users\\natan\\Desktop\\Auto-Using-Git\\AutoUsingCs\\TestProg\\TestProg.csproj";
				// const projectName = "TestProg";
				// let projectFolder = getProjectRootDirOfFilePath(document.fileName);
				// let projectPath = getFullPathToProjectOfFile(projectFolder);
				// let projectName = getProjectName(document.fileName);


				completionData = await this.server.getAllReferences(this.projectName, this.wordToComplete);
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
	private async getExtensionMethods(callerType: Type): Promise<Reference[]> {
		let hierachiesPromise = this.server.getAllHiearchies(this.projectName);

		let hierachies = await hierachiesPromise;

		let classPos = binSearch(hierachies, callerType.class, ((h1, h2) => h1.localeCompare(h2.class)));
		if (classPos === - 1) return [];

		let extensibleClasses = hierachies[classPos];

		if (extensibleClasses.namespaces.length === 1) {
			let baseclasses = extensibleClasses.namespaces[0].parents;
			// Add the class itself to the list of classes that we will get extension methods for.
			let classItselfStr = extensibleClasses.namespaces[0].namespace + "." + callerType.class;
			// Remove generic marker '<>'
			if (classItselfStr[classItselfStr.length - 1] === ">") classItselfStr = classItselfStr.substr(0, classItselfStr.length - 2);
			baseclasses.push(classItselfStr);

			// let extensions = flatten(
				// baseclasses.map(baseclass =>
				// 	extensionMethods[binSearch(extensionMethods, baseclass, (str, ext) => str.localeCompare(ext.extendedClass))])
				// 	.filter(obj => typeof obj !== "undefined")
				// 	.map(extendedClass => extendedClass.extensionMethods));


			return this.findExtensionMethodsOfAllBaseClasses(baseclasses);

		} else {
			throw new Error("Auto Using does not support ambigous references yet.");
		}
	}

	private async findExtensionMethodsOfAllBaseClasses(baseclasses: string[]): Promise<Reference[]> {
		// Request extensions from server
		let extensionMethods = await this.server.getAllExtensionMethods(this.projectName, this.wordToComplete);
		// Get the extension methods we need for our base classes
		let extensionMethodsOfBaseClasses = baseclasses.map(baseclass =>
			extensionMethods[binSearch(extensionMethods, baseclass, (str, ext) => str.localeCompare(ext.extendedClass))]);
		// Convert the extension method objects into references object which we can insert as completions
		let references = extensionMethodsOfBaseClasses.filter(obj => typeof obj !== "undefined")
			.map(extendedClass => extendedClass.extensionMethods);
		return flatten(references);
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

		for (let i = 0; i < completionAmount; i++) {

			let reference = references[i];
			let name = reference.name;
			let isCommon = binarySearch(commonNames, name) !== -1;

			let thereIsOnlyOneClassWithThatName = reference.namespaces.length === 1;

			// We instantly put the using statement only if there is only one option
			let usingStatementEdit = thereIsOnlyOneClassWithThatName ? [usingEdit(reference.namespaces[0])] : undefined;

			let completion: vscode.CompletionItem = {
				label: isCommon ? name : SORT_CHEAT + name,
				insertText: name,
				filterText: name,
				kind: vscode.CompletionItemKind.Reference,
				additionalTextEdits: usingStatementEdit,
				commitCharacters: ["."],
				detail: reference.namespaces.join("\n"),
				command: { command: HANDLE_COMPLETION, arguments: [reference], title: "handles completion" }
			};

			completions[i] = completion;
		}

		return completions;
	}


}


const usingEdit = (namespace: string) => vscode.TextEdit.insert(new vscode.Position(0, 0), `using ${namespace};\n`);


/**
 * Removes all namespaces that already have a using statement
 */
function filterOutAlreadyUsing(references: Reference[], usings: string[]): number {
	usings.sort();

	let referenceAmount = references.length;

	for (let i = 0; i < referenceAmount; i++) {
		let namespaceAmount = 0;
		try {
			// console.log(i);
			// console.log(JSON.stringify(references[i]));
			namespaceAmount = references[i].namespaces.length;

		} catch{
			let x = 2;
		}

		for (let j = 0; j < namespaceAmount; j++) {
			// Get rid of references that their usings exist
			if (binarySearch<string>(usings, references[i].namespaces[j]) !== -1) {
				references[i].namespaces[j] = references[i].namespaces[namespaceAmount - 1];
				references[i].namespaces.length -= 1;
				j--;
				namespaceAmount--;
			}
		}

		// Get rid of empty references
		if (references[i].namespaces.length === 0) {
			references[i] = references[referenceAmount - 1];
			references.length -= 1;
			i--;
			referenceAmount--;
		}
	}

	return referenceAmount;

}


