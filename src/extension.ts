'use strict';

import * as vscode from 'vscode';
import { CompletionProvider, getStoredCompletions } from './CompletionProvider';
import { SORT_CHEAT } from './Constants';
import { execFileSync, spawn, execFile } from 'child_process';
import { Benchmarker } from './Benchmarker';
import { AutoUsingServer } from './server/AutoUsingServer';

const CSHARP = "csharp";

export const PROJECT_NAME = "auto-using";
export const HANDLE_COMPLETION = "extension.handleCompletion";
export const WIPE_STORAGE_COMMAND = "extension.wipeCommon";
export const COMPLETION_STORAGE = "commonwords";

export const PROJECT_ID = "fudge.auto-using";
export const PREFERENCE_RECIEVED = "preferenceRecieved";



export class Completion {
	constructor(public label: string, public namespace: string) { }
}

export function completionCommon(completion: Completion, completions: Completion[]): boolean {
	return completions.some(c => c.label === completion.label && c.namespace === completion.namespace);
}

class TestHelper {

	constructor(private context: vscode.ExtensionContext) {
		if (this.context === undefined) {
			console.log(this.context);
		}
	}


}

export let testHelper: TestHelper;

const testServer = "C:\\Users\\natan\\Desktop\\Auto-Using-Git\\AutoUsingCs\\TestProg\\bin\\Debug\\netcoreapp2.1\\TestProg.dll";

export async function activate(context: vscode.ExtensionContext): Promise<void> {

	let bench = new Benchmarker();
	// let server = execFile(`dotnet`, [testServer]);
	// server.stdout.on('data', (data) => {
	// 	console.log(`stdout: ${data}`);
	// });

	// server.stdin.write("do shit!\n");
	// server.stdin.write("do shit!\n");
	// server.stdin.write("do shit!\n");


	// server.on('close', (code) => {
	// 	console.log(`child process exited with code ${code}`);
	// });

	let server = new AutoUsingServer();


	testHelper = new TestHelper(context);


	let handleCompletionCommand = vscode.commands.registerCommand(HANDLE_COMPLETION, async (reference: Reference) => {
		if (reference.namespaces.length > 1) {

			let completions = getStoredCompletions(context);


			let namespacesSorted = await Promise.all(reference.namespaces.sort((n1, n2) => {
				let firstPrio = completionCommon(new Completion(reference.name, n1), completions);
				let secondPrio = completionCommon(new Completion(reference.name, n2), completions);

				if (firstPrio && !secondPrio) return -1;
				if (!firstPrio && secondPrio) return 1;
				return n1.localeCompare(n2);

			}));


			vscode.window.showQuickPick(namespacesSorted).then(pick => addUsing(pick, context, reference));
		} else {
			storeCompletion(context, new Completion(reference.name, reference.namespaces[0]));
		}
	});

	// Remove all stored completions
	let wipeStorageCommand = vscode.commands.registerCommand(WIPE_STORAGE_COMMAND, () => wipeStoredCompletions(context));

	//TODO add this to test helper
	let autoUsingProvider = vscode.languages.registerCompletionItemProvider({ scheme: "file", language: CSHARP }, new CompletionProvider(context), ".");

	context.subscriptions.push(autoUsingProvider, handleCompletionCommand, wipeStorageCommand);
}

export function wipeStoredCompletions(context: vscode.ExtensionContext): void {
	let amount = getStoredCompletions(context).length;
	vscode.window.showInformationMessage(`Wiped memories of ${amount} references`);
	context.globalState.update(COMPLETION_STORAGE, []);
}

export async function addUsing(pick: string | undefined, context: vscode.ExtensionContext, reference: Reference): Promise<void> {
	if (typeof pick === "undefined") return;
	// Remove invisible unicode char
	if (pick[0] === SORT_CHEAT) pick = pick.substr(1, pick.length);

	storeCompletion(context, new Completion(reference.name, pick));

	let editBuilder = (textEdit: any) => {
		textEdit.insert(new vscode.Position(0, 0), `using ${pick};\n`);
	};

	await vscode.window.activeTextEditor!.edit(editBuilder);


}

export function storeCompletion(context: vscode.ExtensionContext, completion: Completion): void {
	let completions = getStoredCompletions(context);
	if (Array.isArray(completions) && completions[0] instanceof Completion) {
		if (!completionCommon(completion, completions)) {
			completions.push(completion);
			context.globalState.update(COMPLETION_STORAGE, completions);
		}
	}
	else {
		context.globalState.update(COMPLETION_STORAGE, [completion]);
	}

}

