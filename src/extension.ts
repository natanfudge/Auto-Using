'use strict';

import * as vscode from 'vscode';
import { homedir } from 'os';
import { CompletionProvider, NO_PREFIX } from './CompletionProvider';

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

const NO_PREFIX_OPTION = "Old (None)";
const CURLY_BRACKETS_OPTION = "Default - '{Import}'";
const SQUIGGLE_OPTION = "'~'";
const PARENTHESES_OPTION = "~(Import)";

export async function activate(context: vscode.ExtensionContext) {

	if(!context.globalState.get<Boolean>(PREFERENCE_RECIEVED)){
		askForPrefixPreference(context);
	}

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
		context.globalState.update(COMPLETION_STORAGE, []);
	});



	let provider1 = vscode.languages.registerCompletionItemProvider(CSHARP, new CompletionProvider(context));


	context.subscriptions.push(provider1, storeCompletionCommand, wipeStorageCommand);
}

function askForPrefixPreference(context : vscode.ExtensionContext) {
	vscode.window.showInformationMessage("A change was made to make 'Auto Using for C#' clutter Intellisense less. References that were never imported will now be prefixed. What prefix would you like?",
		CURLY_BRACKETS_OPTION, NO_PREFIX_OPTION, SQUIGGLE_OPTION, PARENTHESES_OPTION).then((chosen) => {
			let prefix = "";
			switch (chosen) {
				case NO_PREFIX_OPTION:
					prefix = NO_PREFIX;
					break;
				case CURLY_BRACKETS_OPTION:
					prefix = "{Import}";
					break;
				case SQUIGGLE_OPTION:
					prefix = "~";
					break;
				case PARENTHESES_OPTION:
					prefix = "~(Import)";
					break;
			}
			vscode.workspace.getConfiguration(PROJECT_NAME).update(NO_PREFIX_OPTION, prefix);
			context.globalState.update(PREFERENCE_RECIEVED,true);
			vscode.window.showInformationMessage("You can change this in the settings at any time.", "OK");
		});
}

