import { references } from './hardcodedreferences';
import { STORE_COMPLETION_COMMAND, COMPLETION_STORAGE as COMMON_COMPLETE_STORAGE, Completion, completionExists, PROJECT_NAME } from './extension';
import * as vscode from "vscode";
import { TypeLookupResponse, TypeLookupRequest } from './omnisharp/interfaces';
import { createRequest } from './omnisharp/util';

export const SORT_CHEAT = "\u200B";

const syntaxChars = ["{", "}", "(", ")", "[", "]", "<", ">", "@", ";", "=", "%", "&", "*", "+", ",", "-", "/", ":", "?", "^", "|"];

const showSuggestFor = ["abstract", "new", "protected", "return", "sizeof", "struct", "using", "volatile", "as",
	"checked", "explicit", "fixed", "goto", "lock", "override", "public", "stackalloc", "unchecked",
	"static", "base", "case", "else", "extern", "if", "params", "readonly", "sealed", "static", "typeof", "unsafe", "virtual", "const", "implicit",
	"internal", "private", "await"
];




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
		return /\s/.test(char);
	}




	private isSpecialChar(char: string) {
		return syntaxChars.includes(char);
	}

	private async getCurrentType(position: vscode.Position): Promise<string> {
		try{
			let hover = <vscode.Hover[]>(await vscode.commands.executeCommand("vscode.executeHoverProvider", this.document.uri, position));

			let str = (<{ language: string; value: string }>hover[0].contents[1]).value;
	
			const start = 10;
	
			let typeStart = str.substring(start, str.length);
	
			let i: number;
			for (i = 0; typeStart[i] != " " && typeStart[i] != "\n"; i++);
	
			let type = typeStart.substr(0, i);
	
			return type;
		}catch{
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


	async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
		this.document = document;
		let requiredCompletion = await this.isPlaceToComplete(position);
		if(requiredCompletion === false) return [];
		if(requiredCompletion !== true){
			// console.log("Type = " + requiredCompletion);
			return [];
		}

		// Get available types from the references file and filter out o
		let types = references.toString().split("\n");
		let usings = await this.getUsingsInFile(document);

		// Filter out stuff that we are using already
		types = await Promise.all(types.filter(type => !usings.includes(type.split(" ")[1])));
		
		let completions = types.map(type =>{
			let [clazz, namespace] = type.split(" ");

			let prioritized = this.context.globalState.get<Completion[]>(COMMON_COMPLETE_STORAGE);


			let completionData: Completion = { label: clazz, namespace: namespace };

			let priorityCompletion = completionExists(completionData, prioritized);

			// Build vscode completion object
			return {
				label: priorityCompletion ? clazz : SORT_CHEAT + clazz,
				insertText: clazz,
				filterText: clazz,
				kind: vscode.CompletionItemKind.Reference,
				detail: namespace,
				additionalTextEdits: [vscode.TextEdit.insert(new vscode.Position(0, 0), `using ${namespace};\n`)],
				commitCharacters: ['.'],
				command: { command: STORE_COMPLETION_COMMAND, arguments: [completionData], title: "amar" },
			};

			
		});
		


		// // let completions = new Array<vscode.CompletionItem>(types.length);


		// for (let i = 0; i < types.length; i++) {

			


		// 	completions[i] = completion;

		// }

		// return all completion items as array
		return completions;
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