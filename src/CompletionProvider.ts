import { HANDLE_COMPLETION, COMPLETION_STORAGE as COMMON_COMPLETE_STORAGE, Completion, PROJECT_NAME, completionCommon } from './extension';
import * as vscode from "vscode";
import { TypeLookupResponse, TypeLookupRequest } from './omnisharp/interfaces';
import { createRequest } from './omnisharp/util';
import { references } from './csReferences';
import { binarySearch } from './speedutil';

export const SORT_CHEAT = "\u200B";

const syntaxChars = ["{", "}", "(", ")", "[", "]", "<", ">", "@", ";", "=", "%", "&", "*", "+", ",", "-", "/", ":", "?", "^", "|"];

const showSuggestFor = ["abstract", "new", "protected", "return", "sizeof", "struct", "using", "volatile", "as",
	"checked", "explicit", "fixed", "goto", "lock", "override", "public", "stackalloc", "unchecked",
	"static", "base", "case", "else", "extern", "if", "params", "readonly", "sealed", "static", "typeof", "unsafe", "virtual", "const", "implicit",
	"internal", "private", "await"
];

export class Reference {
	constructor(public name: string, public namespaces: string[]) { }
}



export class CompletionProvider implements vscode.CompletionItemProvider {
	private document: vscode.TextDocument;

	constructor(private context: vscode.ExtensionContext) { }

	private getCharAtPos(pos: vscode.Position): string {
		return this.document.getText(new vscode.Range(pos, pos.translate(0, 1)));
	}

	private getPrevPos(pos: vscode.Position): vscode.Position {
		// console.log(document.offsetAt(pos));
		return this.document.positionAt(this.document.offsetAt(pos) - 1);
	}

	private isWhitespace(char: string): boolean {
		return /\s/.test(char) || char == "";
	}




	private isSpecialChar(char: string) {
		return syntaxChars.includes(char);
	}

	private async getCurrentType(position: vscode.Position): Promise<string> {
		try {
			let hover = <vscode.Hover[]>(await vscode.commands.executeCommand("vscode.executeHoverProvider", this.document.uri, position));

			let str = (<{ language: string; value: string }>hover[0].contents[1]).value;

			const start = 10;

			let typeStart = str.substring(start, str.length);

			let i: number;
			for (i = 0; typeStart[i] != " " && typeStart[i] != "\n"; i++);

			let type = typeStart.substr(0, i);

			return type;
		} catch{
			return "ERROR";
		}
	}

	private async isPlaceToComplete(position: vscode.Position): Promise<boolean | string> {
		let currentPos = this.getPrevPos(position);
		// let currentPos = position;

		let currentChar = this.getCharAtPos(currentPos);

		// Travel to before this word
		while (!this.isWhitespace(currentChar)) {
			if (currentChar === ".") {
				return await this.getCurrentType(this.getTypeInfoLocation(currentPos));
				// return "";
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

	private measure(name: string) {
		let now: number = this.performance.now();
		console.log(name + " = " + (now - this.startTime));
		// this.startTime = now;
	}

	startTime: number;
	performance: any;


	async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): Promise<vscode.CompletionItem[]> {


		this.document = document;
		let requiredCompletion = await this.isPlaceToComplete(position);
		this.measure("placetocomplete");
		if (requiredCompletion === false) return [];
		if (requiredCompletion !== true) {
			return [];
		}


		let usings = await this.getUsingsInFile(document);
		this.measure("getusings");

		let completions = this.referencesToCompletions(references, usings);

		this.measure("all");

		return completions;

		





	}



	private referencesToCompletions(references: Reference[], usings: string[]): vscode.CompletionItem[] {
		// this.measure("before");
		let completionAmount = filterOutAlreadyUsing(references, usings);
		// this.measure("filterout");

		let commonNames = this.context.globalState.get<Completion[]>(COMMON_COMPLETE_STORAGE).map(completion => completion.label);

		commonNames.sort();

		let completions = new Array<vscode.CompletionItem>(completionAmount);
		// let usingStatementEdit = oneOption ? [usingEdit(reference.namespaces[0])] : undefined
		// let completion: vscode.CompletionItem = { label: "", kind: ,  };

		for (let i = 0; i < completionAmount; i++) {
			let reference = references[i];
			let name = reference.name;
			let isCommon = binarySearch(commonNames, name) != -1;


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


		// let ref = references.map(async reference => {

		// 	let priorityCompletion = await reference.namespaces.some(namespace => completionCommon(new Completion(reference.name, namespace), prioritized));

		// 	let oneOption = reference.namespaces.length === 1;

		// 	// We instantly put the using statement only if there is only one option
		// 	let usingStatementEdit = oneOption ? [usingEdit(reference.namespaces[0])] : undefined;


		// 	// Build vscode completion object
		// 	let completion: vscode.CompletionItem = {
		// 		label: priorityCompletion ? reference.name : SORT_CHEAT + reference.name,
		// 		insertText: reference.name,
		// 		filterText: reference.name,
		// 		kind: vscode.CompletionItemKind.Reference,
		// 		detail: reference.namespaces.join("\n"),
		// 		additionalTextEdits: usingStatementEdit,
		// 		commitCharacters: ['.'],
		// 		command: { command: HANDLE_COMPLETION, arguments: [reference], title: "handles completion" },
		// 	};

		// 	return completion;


		// });



		// return Promise.all(ref);
	}

	/**
	 * @param document The text document to search usings of
	 * @returns A list of the namespaces being used in the text document
	 */
	private async getUsingsInFile(document: vscode.TextDocument): Promise<string[]> {
		let regExp = /^using.*;/gm;
		let matches = document.getText().match(regExp);
		if (matches == null) return [];
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
			if (binarySearch<string>(usings, references[i].namespaces[j]) != -1) {
				references[i].namespaces[j] = references[i].namespaces[m - 1];
				j--;
				m--;
			}
		}

		// Get rid of empty references
		if (references[i].namespaces.length == 0) {
			references[i] = references[n - 1];
			i--;
			n--;
		}
	}

	return n;

}
