'use strict';

import * as vscode from 'vscode';
import { readFileSync } from 'fs';
import { stringify } from 'querystring';
import { references } from './hardcodedreferences';

const TXT = "plaintext";
const CSHARP = "csharp";

export async function activate(context: vscode.ExtensionContext) {




	let provider1 = vscode.languages.registerCompletionItemProvider(CSHARP, {



		async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

			let types = references.toString().split("\n");
			let usings = await getUsingsInFile(document);
			types = await Promise.all(types.filter(type => !usings.includes(type.split(" ")[1])));

			// var list = new vscode.CompletionList();
			let completions = new Array<vscode.CompletionItem>(types.length);
			let completionPos = 0;
			for (let i = 0; i < types.length; i++) {


				let type = types[i];
				let [clazz, namespace] = type.split(" ");


				let completion: vscode.CompletionItem = {
					label: clazz,
					kind: vscode.CompletionItemKind.Reference,
					detail: namespace,
					additionalTextEdits: [vscode.TextEdit.insert(new vscode.Position(0, 0), `using ${namespace};\n`)],
					commitCharacters: ['.']
				};


				completions[i] = completion;


			}

			// completions.



			// return all completion items as array
			return completions;
		}
	});

	const provider2 = vscode.languages.registerCompletionItemProvider(
		'plaintext',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

				// get all text until the `position` and check if it reads `console.`
				// and iff so then complete if `log`, `warn`, and `error`
				let linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.endsWith('console.')) {
					return undefined;
				}

				return [
					new vscode.CompletionItem('log', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('warn', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('error', vscode.CompletionItemKind.Method),
				];
			}
		},
		'.' // triggered whenever a '.' is being typed
	);

	context.subscriptions.push(provider1, provider2);
}

async function getUsingsInFile(document: vscode.TextDocument): Promise<string[]> {
	var regExp = /^using.*;/gm;
	var matches = document.getText().match(regExp);
	if (matches == null) return [];
	return await Promise.all(matches.map(async using => {
		var usingWithSC = using.split(" ")[1];
		return usingWithSC.substring(0, usingWithSC.length - 1);
	}));

}
