import { HANDLE_COMPLETION, COMPLETION_STORAGE as COMMON_COMPLETE_STORAGE, Completion, completionExists as completionCommon, PROJECT_NAME } from './extension';
import * as vscode from "vscode";
import { TypeLookupResponse, TypeLookupRequest } from './omnisharp/interfaces';
import { createRequest } from './omnisharp/util';
import { references } from './csReferences';

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


	async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): Promise<vscode.CompletionItem[]> {
		this.document = document;
		let requiredCompletion = await this.isPlaceToComplete(position);
		if (requiredCompletion === false) return [];
		if (requiredCompletion !== true) {
			return [];
		}


		let usings = await this.getUsingsInFile(document);

		let completions = this.referencesToCompletions(references, usings);

		// return all completion items as array
		return completions;
	}



	private async referencesToCompletions(references: Reference[], usings: string[]): Promise<vscode.CompletionItem[]> {
		references = await filterOutAlreadyUsing(references, usings);

		let prioritized = this.context.globalState.get<Completion[]>(COMMON_COMPLETE_STORAGE);

		return references.map(reference => {

			let priorityCompletion = completionCommon(new Completion(reference.name, reference.namespaces[0]), prioritized);

			let oneOption = reference.namespaces.length === 1;

			// We instantly put the using statement only if there is only one option
			let usingStatementEdit = oneOption ? [usingEdit(reference.namespaces[0])] : undefined;


			// Build vscode completion object
			let completion: vscode.CompletionItem = {
				label: priorityCompletion ? reference.name : SORT_CHEAT + reference.name,
				insertText: reference.name,
				filterText: reference.name,
				kind: vscode.CompletionItemKind.Reference,
				detail: reference.namespaces.join("\n"),
				additionalTextEdits: usingStatementEdit,
				commitCharacters: ['.'],
				command: { command: HANDLE_COMPLETION, arguments: [reference], title: "handles completion" },
			};

			return completion;


		});
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

async function filterOutAlreadyUsing(references: Reference[], usings: string[]): Promise<Reference[]> {
	return await Promise.all(references.map(reference => new Reference(reference.name, reference.namespaces.filter(namespace => !usings.includes(namespace)))).filter(reference => reference.namespaces.length > 0));
}
