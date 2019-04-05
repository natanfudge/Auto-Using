import { workspace, Disposable, ExtensionContext, Position, Hover, commands, TextDocument, Uri, window } from 'vscode';
import { LanguageClient, LanguageClientOptions, SettingMonitor, ServerOptions, TransportKind, InitializeParams } from 'vscode-languageclient';
import { Trace } from 'vscode-jsonrpc';
import { getAllProjectFiles } from './util';

export class TestHelper {

    constructor(private client: LanguageClient, private started: boolean = false) { }
}

interface SetupWorkspaceRequest {
    projects: string[];
    workspaceStorageDir: string;
    globalStorageDir: string;
    extensionDir: string;

}

interface HoverRequest {
    pos: Position;
    filePath: string;
}
interface Completion {
    Name: string;
    Namespaces: string[];
}

const hoverRequest = "custom/hoverRequest";
const serverExe = 'dotnet';
const serverLocation = "C:/Users/natan/Desktop/Auto-Using-Git/AutoUsingCs/AutoUsing/bin/Debug/netcoreapp2.1/AutoUsing.dll";
const HANDLE_COMPLETION = "custom/handleCompletion";
export const SORT_CHEAT = "\u200B";
export let testHelper: TestHelper;

let client: LanguageClient;

export function activate(context: ExtensionContext) {

    let commandDisposable = commands.registerCommand(HANDLE_COMPLETION, async (completion: Completion) => {
        if (completion.Namespaces.length > 1) {

            let completions = getStoredCompletions(context);


            let namespacesSorted = await Promise.all(completion.Namespaces.sort((n1, n2) => {
                let firstPrio = completionCommon(new StoredCompletion(completion.Name, n1), completions);
                let secondPrio = completionCommon(new StoredCompletion(completion.Name, n2), completions);

                if (firstPrio && !secondPrio) return -1;
                if (!firstPrio && secondPrio) return 1;
                return n1.localeCompare(n2);

            }));


            window.showQuickPick(namespacesSorted).then(pick => addUsing(pick, context, completion));
        } else {
            storeCompletion(context, new StoredCompletion(completion.Name, completion.Namespaces[0]));
        }
    });

    var setup: SetupWorkspaceRequest = {
        extensionDir: context.extensionPath,
        projects: getAllProjectFiles(),
        workspaceStorageDir: context.storagePath!,
        globalStorageDir: context.globalStoragePath
    }
    var message = JSON.stringify(setup);
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    let serverOptions: ServerOptions = {
        run: { command: serverExe, args: [serverLocation, message] },
        debug: { command: serverExe, args: [serverLocation, message] }
    }



    let clientOptions: LanguageClientOptions = {
        documentSelector: [
            {
                // pattern: '**/*.cs',
                scheme: "file",
                language: "csharp"
            }
        ],
        synchronize: {
            configurationSection: 'autousing',
            fileEvents: workspace.createFileSystemWatcher('**/*.cs')
        }
        
    }






    // const setupWorkspace = "setupWorkspace";
    // Create the language client and start the client.
    client = new LanguageClient('autousing', 'Auto-Using', serverOptions, clientOptions);
    testHelper = new TestHelper(client);
    client.onReady().then(() => {
        //@ts-ignore
        testHelper.started = true;




        client.onRequest(hoverRequest, async (request: HoverRequest) => {

            let pos: Position = new Position(request.pos.line, request.pos.character);
            let uri = Uri.file(request.filePath);
            let result = await getHoverString(uri, pos);
            if(result == undefined) return undefined;
            let str : string = result;
            return str;
        });

    });
    client.trace = Trace.Verbose;
    let clientDisposable = client.start();

    // Push the disposable to the context's subscriptions so that the
    // client can be deactivated on extension deactivation
    context.subscriptions.push(clientDisposable,commandDisposable);
}

export function deactivate(): Thenable<void> {
    if (!client) {
        return new Promise(() => undefined);
    }
    return client.stop();
}

/**
 * Returns whether or not a completion is included in the list of common completions that are stored. 
 */
export function completionCommon(completion: StoredCompletion, completions: StoredCompletion[]): boolean {
    return completions.some(c => c.label === completion.label && c.namespace === completion.namespace);
}

/**
 * Retrieve from the disk the list of common completions
 */
function getStoredCompletions(context: ExtensionContext): StoredCompletion[] {
    let dir = CommonCompletionDirectory(context);
    let file = CommonCompletionLocation(context);
    if (storageInvalid(file, dir)) return [];

    var text = readFileSync(file).toString();
    // Text should never be empty. 
    if (text == "") {
        InitializeStorage(file);
        return [];
    }

    return JSON.parse(text);
}

/**
 * Adds the completion to the list of common completions in the disk
 */
function storeCompletion(context: ExtensionContext, completion: StoredCompletion) {
    let existingStorage = getStoredCompletions(context);
    existingStorage.push(completion);
    let file = CommonCompletionLocation(context);
    writeFile(file, JSON.stringify(existingStorage), () => null);


}

/**
 * Checks if the required files for the completions exist in the system. If not, it creates them and return false.
 */
function storageInvalid(file: string, dir: string): boolean {
    if (!existsSync(dir)) {
        mkdirSync(dir);
        InitializeStorage(file);
        return true;
    }
    else if (!existsSync(file)) {
        InitializeStorage(file);
        return true;
    }

    return false;
}

/**
 * Inserts a using expression at the start of the document in the active text editor
 */
function addUsing(pick: string | undefined, context: ExtensionContext, completion: Completion): void {
    if (typeof pick === "undefined") return;
    // Remove invisible unicode char
    if (pick[0] === SORT_CHEAT) pick = pick.substr(1, pick.length);

    storeCompletion(context, new StoredCompletion(completion.Name, pick));

    let editBuilder = (textEdit: any) => {
        textEdit.insert(new Position(0, 0), `using ${pick};\n`);
    };

    window.activeTextEditor!.edit(editBuilder);
}

function InitializeStorage(location: string): void {
    writeFileSync(location, "[]");
}

import path = require('path');
import { existsSync, mkdirSync, writeFileSync, readFileSync, writeFile } from 'fs';
const CommonCompletionLocation = (context: ExtensionContext) => path.join(CommonCompletionDirectory(context), "commonCompletions.json");
const CommonCompletionDirectory = (context: ExtensionContext) => path.join(context.globalStoragePath!, "completions");


const typeInfoIdentifier = "```csharp\n";


/**
 * Gets the string that is in the hover result provided by the C# extension in a given position and file uri.
 */
async function getHoverString(uri: Uri, position: Position): Promise<string | undefined> {
    // Get the hover info of the variable from the C# extension
    let hover = <Hover[]>(await commands.executeCommand("vscode.executeHoverProvider", uri, position));
    if (hover.length === 0) return undefined;

    let hovers = hover[0].contents;
    let typeHover = <{ language: string; value: string }>hovers.find(hover =>{
        let cast = <{ language: string; value: string }>hover;
        return cast.value.startsWith(typeInfoIdentifier);
    });

    return typeHover.value;
}

export class StoredCompletion {
    constructor(public label: string, public namespace: string) { }
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

