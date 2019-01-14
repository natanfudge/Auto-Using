import { HANDLE_COMPLETION, Completion, COMPLETION_STORAGE } from './extension';
import * as vscode from "vscode";
import { references } from './csdata/csReferences';
import { binarySearch, binarySearchGen } from './speedutil';
import { extensionMethods } from './csdata/csExtensionMethods';
import { classHierachies } from './csdata/csHierachies';

export const SORT_CHEAT = "\u200B";

const syntaxChars = ["{", "}", "(", ")", "[", "]", "<", ">", "@", ";", "=", "%", "&", "*", "+", ",", "-", "/", ":", "?", "^", "|"];

const showSuggestFor = ["abstract", "new", "protected", "return", "sizeof", "struct", "using", "volatile", "as",
	"checked", "explicit", "fixed", "goto", "lock", "override", "public", "stackalloc", "unchecked",
	"static", "base", "case", "else", "extern", "if", "params", "readonly", "sealed", "static", "typeof", "unsafe", "virtual", "const", "implicit",
	"internal", "private", "await", "this"
];

export class Reference {
	constructor(public name: string, public namespaces: string[]) { }
}

export function getStoredCompletions(context: vscode.ExtensionContext): Completion[] {
	let completions = context.globalState.get<Completion[]>(COMPLETION_STORAGE);

	if (typeof completions === "undefined") return [];//throw new Error("The completion storage is unexpectedly undefined");
	return completions;
}

// interface Primitive{
// 	primName:string;
// 	className:string;
// }
const primitives = {
	bool: "Boolean", byte: "Byte", sbyte: "SByte", char: "Char", decimal: "Decimal",
	double: "Double", float: "Single", int: "Int32", uint: "UInt32", long: "Int64", ulong: "System.UInt64",
	object: "Object", short: "Int16", ushort: "Uint16", string: "String"
};


export class CompletionProvider implements vscode.CompletionItemProvider {
	private document!: vscode.TextDocument;

	constructor(private context: vscode.ExtensionContext) {
	}


	private getCharAtPos(pos: vscode.Position): string {
		return this.document.getText(new vscode.Range(pos, pos.translate(0, 1)));
	}

	private getPrevPos(pos: vscode.Position): vscode.Position {
		return this.document.positionAt(this.document.offsetAt(pos) - 1);
	}

	private isWhitespace(char: string): boolean {
		return /\s/.test(char) || char === "";
	}




	private isSpecialChar(char: string) {
		return syntaxChars.includes(char);
	}

	/**
	 *  @returns The type in the specified position
	 * */
	private async getType(position: vscode.Position): Promise<boolean | string> {
		// Get the hover info of the variable from the C# extension
		let hover = <vscode.Hover[]>(await vscode.commands.executeCommand("vscode.executeHoverProvider", this.document.uri, position));
		if (hover.length === 0) return false;
		// Converts into readable format
		let str = (<{ language: string; value: string }>hover[0].contents[1]).value;

		const start = 10;
		let typeStart = str.substring(start, str.length);

		let generic = false;
		let i: number;
		for (i = 0; typeStart[i] !== " " && typeStart[i] !== "\n"; i++) {
			if (typeStart[i] === "<") {
				generic = true;
				break;
			}
		}

		let type = typeStart.substr(0, i);

		//@ts-ignore
		let typeAsObject: string = primitives[type];
		if (typeof typeAsObject !== "undefined") type = typeAsObject;



		if (generic) type += "<>";

		return type;
	}


	private async isPlaceToComplete(position: vscode.Position): Promise<boolean | string> {
		let currentPos = this.getPrevPos(position);

		let currentChar = this.getCharAtPos(currentPos);

		// Travel to before this word
		while (!this.isWhitespace(currentChar)) {
			if (currentChar === ".") {
				return await this.getType(this.getTypeInfoLocation(currentPos));
			}
			if (syntaxChars.includes(currentChar)) return true;
			currentPos = this.getPrevPos(currentPos);
			currentChar = this.getCharAtPos(currentPos);
		}

		// Travel to the word before this word
		while (this.isWhitespace(currentChar)) {
			currentPos = this.getPrevPos(currentPos);
			currentChar = this.getCharAtPos(currentPos);
		}

		let regex = /([^\s]+)/;

		let wordBefore = this.document.getText(this.document.getWordRangeAtPosition(currentPos, regex));
		let lastChar = wordBefore.slice(-1);

		if (this.isSpecialChar(lastChar)) return true;
		else if (showSuggestFor.includes(wordBefore)) return true;
		return false;
	}

	private getTypeInfoLocation(position: vscode.Position): vscode.Position {
		let hoverInfoContainer = this.getPrevPos(position);
		if (this.getCharAtPos(hoverInfoContainer) === ")") {
			hoverInfoContainer = this.getPrevPos(this.getPrevPos(hoverInfoContainer));
		}
		return hoverInfoContainer;
	}


	public async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): Promise<vscode.CompletionItem[]> {

		this.document = document;
		let requiredCompletion = await this.isPlaceToComplete(position);
		if (requiredCompletion === false) return [];
		if (requiredCompletion !== true) {
			let extensibleClasses = classHierachies[ binarySearchGen(classHierachies, requiredCompletion, ((h1, h2) => h1.localeCompare(h2.class)))];
			if(extensibleClasses.namespaces.length === 1){
				let fathers = extensibleClasses.namespaces[0].fathers;
				let x = 2;
			}else{
				throw new Error("Auto Using does not support ambigous references yet.");
			}
			return [];
		}


		let found = this.filterByTypedWord(document, position);


		let usings = await this.getUsingsInFile(document);

		let completions = this.referencesToCompletions(found, usings);

		return completions;


	}



	private filterByTypedWord(document: vscode.TextDocument, position: vscode.Position) {
		let wordToComplete = '';
		let range = document.getWordRangeAtPosition(position);
		if (range) {
			wordToComplete = document.getText(new vscode.Range(range.start, position)).toLowerCase();
		}
		let matcher = (f: Reference) => f.name.toLowerCase().indexOf(wordToComplete) > -1;
		let found = references.filter(matcher);
		return found;
	}

	private referencesToCompletions(references: Reference[], usings: string[]): vscode.CompletionItem[] {
		let completionAmount = filterOutAlreadyUsing(references, usings);

		let commonNames = getStoredCompletions(this.context).map(completion => completion.label);

		commonNames.sort();

		let completions = new Array<vscode.CompletionItem>(completionAmount);


		for (let i = 0; i < completionAmount; i++) {



			let reference = references[i];
			let name = reference.name;
			if (name === "File") {
				// let x= 2;
			}
			let isCommon = binarySearch(commonNames, name) !== -1;




			let oneOption = reference.namespaces.length === 1;

			// We instantly put the using statement only if there is only one option
			let usingStatementEdit = oneOption ? [usingEdit(reference.namespaces[0])] : undefined;

			let completion = new vscode.CompletionItem(isCommon ? name : SORT_CHEAT + name);

			completion.insertText = name;
			completion.filterText = name;
			completion.kind = vscode.CompletionItemKind.Reference;
			completion.additionalTextEdits = usingStatementEdit;
			completion.commitCharacters = ["."];
			completion.detail = reference.namespaces.join("\n");
			completion.command = { command: HANDLE_COMPLETION, arguments: [reference], title: "handles completion" };

			completions[i] = completion;
		}

		// this.measure("map");

		return completions;




		// return Promise.all(ref);
	}

	/**
	 * @param document The text document to search usings of
	 * @returns A list of the namespaces being used in the text document
	 */
	private async getUsingsInFile(document: vscode.TextDocument): Promise<string[]> {
		let regExp = /^using.*;/gm;
		let matches = document.getText().match(regExp);
		if (matches === null) return [];
		return await Promise.all(matches.map(async using => {
			let usingWithSC = using.split(" ")[1];
			return usingWithSC.substring(0, usingWithSC.length - 1);
		}));

	}

}


export function usingEdit(namespace: string): vscode.TextEdit {
	return vscode.TextEdit.insert(new vscode.Position(0, 0), `using ${namespace};\n`);
}

/**
 * 
 * @param references 
 * @param usings 
 * @returns new size
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
			i--;
			n--;
		}
	}

	return n;

}


