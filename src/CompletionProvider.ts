import * as vscode from 'vscode';
import { references } from './hardcodedreferences';
import { STORE_COMPLETION_COMMAND, COMPLETION_STORAGE as COMMON_COMPLETE_STORAGE, Completion, completionExists, PROJECT_NAME } from './extension';


export const SORT_CHEAT = "\u200B";


export class CompletionProvider {
	extensionContext: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this.extensionContext = context;
	}


	async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

		// Get available types from the references file and filter out o
		let types = references.toString().split("\n");
		let usings = await this.getUsingsInFile(document);
		types = await Promise.all(types.filter(type => !usings.includes(type.split(" ")[1])));


		let completions = new Array<vscode.CompletionItem>(types.length);


		for (let i = 0; i < types.length; i++) {

			let [clazz, namespace] = types[i].split(" ");

			let prioritized = this.extensionContext.globalState.get<Completion[]>(COMMON_COMPLETE_STORAGE);


			let completionData: Completion = { label: clazz, namespace: namespace };

			let priorityCompletion = completionExists(completionData, prioritized);

			// Build vscode completion object
			let completion: vscode.CompletionItem = {
				label: priorityCompletion ? clazz : SORT_CHEAT + clazz,
				insertText:clazz,
				filterText:clazz,
				kind: vscode.CompletionItemKind.Reference,
				detail: namespace,
				additionalTextEdits: [vscode.TextEdit.insert(new vscode.Position(0, 0), `using ${namespace};\n`)],
				commitCharacters: ['.'],
				command: { command: STORE_COMPLETION_COMMAND, arguments: [completionData], title: "amar" },
			};


			completions[i] = completion;

		}

		// return all completion items as array
		return completions;
	}

	/**
	 * @param document The text document to search usings of
	 * @returns A list of the namespaces being used in the text document
	 */
	private async getUsingsInFile(document: vscode.TextDocument): Promise<string[]> {
		var regExp = /^using.*;/gm;
		var matches = document.getText().match(regExp);
		if (matches == null) return [];
		return await Promise.all(matches.map(async using => {
			var usingWithSC = using.split(" ")[1];
			return usingWithSC.substring(0, usingWithSC.length - 1);
		}));

	}

}