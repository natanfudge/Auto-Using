'use strict';

import * as vscode from 'vscode';
import { homedir } from 'os';
import { CompletionProvider, SORT_CHEAT } from './CompletionProvider';
import CSharpExtensionExports from './omnisharp/interfaces';

const TXT = "plaintext";
const CSHARP = "csharp";

export const PROJECT_NAME = "auto-using";
export const STORE_COMPLETION_COMMAND = "extension.storeCompletion";
export const WIPE_STORAGE_COMMAND = "extension.wipeCommon";
export const COMPLETION_STORAGE = "commonwords";

export const PROJECT_ID = "fudge.auto-using";
export const PREFERENCE_RECIEVED = "preferenceRecieved";



export class Completion {
	label: string;
	namespace: string;
}

export function completionExists(completion: Completion, completions: Completion[]) {
	return completions.some(c => c.label === completion.label && c.namespace === completion.namespace);
}




export async function activate(context: vscode.ExtensionContext) {


	let storeCompletionCommand = vscode.commands.registerCommand(STORE_COMPLETION_COMMAND, (completion: Completion) => {
		let completions = context.globalState.get<Completion[]>(COMPLETION_STORAGE);
		if (Array.isArray(completions)) {
			if (!completionExists(completion, completions)) {
				completions.push(completion);
				context.globalState.update(COMPLETION_STORAGE, completions);
			}
		} else {
			context.globalState.update(COMPLETION_STORAGE, [completion]);
		}

	});

	let wipeStorageCommand = vscode.commands.registerCommand(WIPE_STORAGE_COMMAND, (completion: Completion) => {
		let amount = context.globalState.get<Completion[]>(COMPLETION_STORAGE).length;
		vscode.window.showInformationMessage(`Wiped memories of ${amount} references`);
		context.globalState.update(COMPLETION_STORAGE, []);
	});

	// const csharpExtension = vscode.extensions.getExtension<CSharpExtensionExports>("ms-vscode.csharp");
	// await csharpExtension.exports.initializationFinished();
	// const server = await csharpExtension.exports.getAdvisor();


	let provider1 = vscode.languages.registerCompletionItemProvider(CSHARP, new CompletionProvider(context),"."," ");


	context.subscriptions.push(provider1, storeCompletionCommand, wipeStorageCommand);
}

