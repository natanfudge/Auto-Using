import { workspace, Disposable, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, SettingMonitor, ServerOptions, TransportKind, InitializeParams } from 'vscode-languageclient';
import { Trace } from 'vscode-jsonrpc';

export function activate(context: ExtensionContext) {

    console.log("adsfasdf!");

    // The server is implemented in node
    let serverExe = 'dotnet';
    const serverLocation = "C:/Users/natan/Desktop/Auto-Using-Git/AutoUsingCs/AutoUsing/bin/Debug/netcoreapp2.1/AutoUsing.dll";

    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    let serverOptions: ServerOptions = {
        run: { command: serverExe, args: [serverLocation] },
        debug: { command: serverExe, args: [serverLocation] }
    }

   
//TODO: Send SetupWorkspace from client to server
    // Create the language client and start the client.
    const client = new LanguageClient('autousing', 'Auto-Using', serverOptions, {});
    // client.onReady().then(() =>{
    //     client.onRequest("custom/data",(reqargs) =>{
    //         console.log("Got request with args " + reqargs);
    //         return "op response";
    //     });
    //     client.onNotification("custom/data",(args) =>{
    //         console.log("Got notif with args " + args);
    //         return "op response";
    //     });
    // });
    client.trace = Trace.Verbose;
    let disposable = client.start();

    // Push the disposable to the context's subscriptions so that the
    // client can be deactivated on extension deactivation
    context.subscriptions.push(disposable);
}


// 'use strict';

// import * as vscode from 'vscode';
// import { CompletionProvider, getStoredCompletions } from './CompletionProviderFUCK';
// import { SORT_CHEAT } from './Constants';
// import { execFileSync, spawn, execFile } from 'child_process';
// import { Benchmarker } from './Benchmarker';
// import { AutoUsingServer } from './server/AutoUsingServer';
// import { getAllProjectFiles } from './util';
// import { watch } from 'fs';
// import { join } from 'path';
// import { Completion } from './server/Protocol';
// // const fsWatcher = require("fs.")

// const CSHARP = "csharp";

// export const HANDLE_COMPLETION = "extension.handleCompletion";
// export const WIPE_STORAGE_COMMAND = "extension.wipeCommon";
// export const COMPLETION_STORAGE = "commonwords";





// export class StoredCompletion {
// 	constructor(public label: string, public namespace: string) { }
// }

// export function completionCommon(completion: StoredCompletion, completions: StoredCompletion[]): boolean {
// 	return completions.some(c => c.label === completion.label && c.namespace === completion.namespace);
// }

// class TestHelper {

// 	constructor(private context: vscode.ExtensionContext, private server: AutoUsingServer) {
// 		if (this.context === undefined) {
// 			// console.log(this.context);
// 		}
// 	}


// }

// export let testHelper: TestHelper;

// // const testServer = ;

// export async function activate(context: vscode.ExtensionContext): Promise<void> {


// 	let handleCompletionCommand = vscode.commands.registerCommand(HANDLE_COMPLETION, async (completion: Completion) => {
// 		if (completion.namespaces.length > 1) {

// 			let completions = getStoredCompletions(context);


// 			let namespacesSorted = await Promise.all(completion.namespaces.sort((n1, n2) => {
// 				let firstPrio = completionCommon(new StoredCompletion(completion.name, n1), completions);
// 				let secondPrio = completionCommon(new StoredCompletion(completion.name, n2), completions);

// 				if (firstPrio && !secondPrio) return -1;
// 				if (!firstPrio && secondPrio) return 1;
// 				return n1.localeCompare(n2);

// 			}));


// 			vscode.window.showQuickPick(namespacesSorted).then(pick => addUsing(pick, context, completion));
// 		} else {
// 			storeCompletion(context, new StoredCompletion(completion.name, completion.namespaces[0]));
// 		}
// 	});

// 	// Remove all stored completions
// 	let wipeStorageCommand = vscode.commands.registerCommand(WIPE_STORAGE_COMMAND, () => wipeStoredCompletions(context));

// 	let server = new AutoUsingServer();
// 	testHelper = new TestHelper(context, server);

// 	context.subscriptions.push(new vscode.Disposable(() => server.stop()));


// 	server.setupWorkspace(getAllProjectFiles(), context.storagePath!,context.extensionPath);
// 	let autoUsingProvider = vscode.languages.registerCompletionItemProvider({ scheme: "file", language: CSHARP },
// 		new CompletionProvider(context, server), ".");

// 	context.subscriptions.push(autoUsingProvider, handleCompletionCommand, wipeStorageCommand);

// }

// export function wipeStoredCompletions(context: vscode.ExtensionContext): void {
// 	let amount = getStoredCompletions(context).length;
// 	vscode.window.showInformationMessage(`Wiped memories of ${amount} completions`);
// 	context.globalState.update(COMPLETION_STORAGE, []);
// }

// export async function addUsing(pick: string | undefined, context: vscode.ExtensionContext, completion: Completion): Promise<void> {
// 	if (typeof pick === "undefined") return;
// 	// Remove invisible unicode char
// 	if (pick[0] === SORT_CHEAT) pick = pick.substr(1, pick.length);

// 	storeCompletion(context, new StoredCompletion(completion.name, pick));

// 	let editBuilder = (textEdit: any) => {
// 		textEdit.insert(new vscode.Position(0, 0), `using ${pick};\n`);
// 	};

// 	await vscode.window.activeTextEditor!.edit(editBuilder);


// }

// export function storeCompletion(context: vscode.ExtensionContext, completion: StoredCompletion): void {
// 	let completions = getStoredCompletions(context);
// 	if (Array.isArray(completions) && completions[0] instanceof StoredCompletion) {
// 		if (!completionCommon(completion, completions)) {
// 			completions.push(completion);
// 			context.globalState.update(COMPLETION_STORAGE, completions);
// 		}
// 	}
// 	else {
// 		context.globalState.update(COMPLETION_STORAGE, [completion]);
// 	}

// }

