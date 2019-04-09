/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import * as vscode from "vscode";

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind,
    Trace
} from 'vscode-languageclient';
import { join } from 'path';
import {
    TestHelper, Completion, getStoredCompletions, completionCommon, StoredCompletion, addUsing, storeCompletion, SetupWorkspaceRequest,
    getAllProjectFiles, HoverRequest, getHoverString
} from './util';
import { readdirSync, unlink, unlinkSync, readdir, Stats, lstat, lstatSync } from 'fs';
import { promisify } from 'util';


const debugServerLocation = join("server", "AutoUsing", "bin", "Debug", "netcoreapp2.1", "AutoUsing.dll");
const releaseServerLocation = join("server", "AutoUsing", "bin", "Debug", "netcoreapp2.1", "publish", "AutoUsing.dll");
// const relativeServerLocation = debugging? debugServerLocation : releaseServerLocation;
const hoverRequest = "custom/hoverRequest";
const dotnetExe = 'dotnet';
const HANDLE_COMPLETION = "custom/handleCompletion";
const CLEAN_CACHE = "autousing.cleanCache";
export let testHelper: TestHelper;
let client: LanguageClient;
export function activate(context: vscode.ExtensionContext): void {

    // The server is implemented in node
    let releaseServerModule = context.asAbsolutePath(releaseServerLocation);
    let debugServerModule = context.asAbsolutePath(debugServerLocation);

    let setup: SetupWorkspaceRequest = {
        extensionDir: context.extensionPath,
        projects: getAllProjectFiles(),
        workspaceStorageDir: context.storagePath!,
        globalStorageDir: context.globalStoragePath
    };

    let message = JSON.stringify(setup);

    let serverOptions: ServerOptions = {
        run: { command: dotnetExe, args: [releaseServerModule, message] },
        debug: { command: dotnetExe, args: [debugServerModule, message] },
    };

    let clientOptions: LanguageClientOptions = {
        documentSelector: [
            {
                scheme: "file",
                language: "csharp"
            }
        ],
        synchronize: {
            configurationSection: 'autousing',
            fileEvents: vscode.workspace.createFileSystemWatcher('**/*.cs')
        }

    };
// "dependencies": {
	// 	"package": "^1.0.1",
	// 	"vsce": "^1.59.0",
	// 	"vscode-jsonrpc": "^4.0.0",
	// 	"vscode-languageclient": "^5.2.1",
	// 	"vscode-languageserver-protocol": "^3.15.0-next.1",
	// 	"vscode-languageserver-types": "^3.14.0"
	// },

    // Create the language client and start the client.
    client = new LanguageClient('autousing', 'Auto-Using', serverOptions, clientOptions);
    testHelper = new TestHelper(client);
    client.onReady().then(() => {
        //@ts-ignore
        testHelper.started = true;


        client.onRequest(hoverRequest, async (request: HoverRequest) => {

            let pos: vscode.Position = new vscode.Position(request.pos.line, request.pos.character);
            let uri = vscode.Uri.file(request.filePath);
            let result = await getHoverString(uri, pos);
            if (result === undefined) return undefined;
            let str: string = result;
            return str;
        });

    });

    client.trace = chosenTrace();
    let clientDisposable = client.start();

    // Push the disposable to the context's subscriptions so that the
    // client can be deactivated on extension deactivation
    context.subscriptions.push(clientDisposable, registerHandleCompletionCommand(context), registerCleanGlobalCacheCommand(context));
}

function registerHandleCompletionCommand(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.commands.registerCommand(HANDLE_COMPLETION, async (completion: Completion) => {
        if (completion.Namespaces.length > 1) {
            let completions = getStoredCompletions(context);
            let namespacesSorted = await Promise.all(completion.Namespaces.sort((n1, n2) => {
                let firstPrio = completionCommon(new StoredCompletion(completion.Name, n1), completions);
                let secondPrio = completionCommon(new StoredCompletion(completion.Name, n2), completions);
                if (firstPrio && !secondPrio)
                    return -1;
                if (!firstPrio && secondPrio)
                    return 1;
                return n1.localeCompare(n2);
            }));
            vscode.window.showQuickPick(namespacesSorted).then(pick => addUsing(pick, context, completion));
        }
        else {
            storeCompletion(context, new StoredCompletion(completion.Name, completion.Namespaces[0]));
        }
    });
}

/**
 * Destroy all of the files located at globalStoragePath/cache
 */
async function cleanGlobalCache(context: vscode.ExtensionContext): Promise<void> {
    let dir = join(context.globalStoragePath, globalCacheLocation);
    await removeDirectoryContents(dir);
}


const readdirPromise = promisify(readdir);
const lstatPromise = promisify(lstat);
const unlinkPromise = promisify(unlink);
/**
 * Destroy all autousing cache files in all workspace storage directories
 */
async function cleanAllWorkspaceCache(context: vscode.ExtensionContext): Promise<void> {
    // Go up to the workspaceStorage dir
    let allWorkspaceStorageDir = path.dirname(path.dirname(context.storagePath));
    //TODO: technically this could be sped up by dumping everything into a list of promises and then at the end awaiting it.

    let workspaceDirs = await readdirPromise(allWorkspaceStorageDir);
    // Go through the weird generated numbers workspace directories 
    for (let workspaceDir of workspaceDirs) {
        let absoluteWorkspaceDir = join(allWorkspaceStorageDir, workspaceDir);
        // Ignore files that are not folders
        if (!(await lstatPromise(absoluteWorkspaceDir)).isDirectory()) continue;
        // Go through the files in a specific workspace directory
        let workspaceFiles = await readdirPromise(absoluteWorkspaceDir);
        for (let workspaceFile of workspaceFiles) {
            // Go only inside the auto-using storage directory
            if (workspaceFile === extensionId) {
                // Go through the cache files of a specific workspace
                let cacheDir = join(allWorkspaceStorageDir, workspaceDir, workspaceFile, workspaceCacheLocation);
                let projectCaches = await readdirPromise(cacheDir);
                // Remove the cache files of all projects of the workspace
                for (let projectCacheDir of projectCaches) {
                   await removeDirectoryContents(join(cacheDir, projectCacheDir));
                }
            }

        }
    }

   



    // // Callback hell inc.
    // readdir(allWorkspaceStorageDir, (e1, workspaceDirs) => {

    //     for (let workspaceDir of workspaceDirs) {
    //         // Go through the weird number directories
    //         lstat(join(allWorkspaceStorageDir, workspaceDir), (e2, stats) => {
    //             if (stats.isDirectory()) {
    //                 // Go through the files in a specific workspace directory
    //                 readdir(join(allWorkspaceStorageDir, workspaceDir), (e3, files) => {
    //                     for (let file of files) {
    //                         // Go inside the auto-using storage directory
    //                         if (file === extensionId) {
    //                             // Go through the cache files of a specific workspace
    //                             let cacheDir = join(allWorkspaceStorageDir, workspaceDir, file, workspaceCacheLocation);
    //                             readdir(cacheDir, (e4, projectCaches) => {
    //                                 // Remove the cache files of all projects of the workspace
    //                                 for (let projectCacheDir of projectCaches) {
    //                                     removeDirectoryContents(join(cacheDir, projectCacheDir));
    //                                 }
    //                             });

    //                         }
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // });
}



async function removeDirectoryContents(dir: string): Promise<void> {
    for(let file of await readdirPromise(dir)){
        await unlinkPromise(join(dir, file));
    }
}

const extensionId = "fudge.auto-using";

function registerCleanGlobalCacheCommand(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.commands.registerCommand(CLEAN_CACHE, async () => {
        await Promise.all([cleanGlobalCache(context),cleanAllWorkspaceCache(context)]);

        const reloadOption = "Yes, reload.";

        let choice = await vscode.window.showInformationMessage("Caches have been cleaned. Would you like to reload the window to apply changes?",
            reloadOption);
        if (choice === reloadOption) {
            vscode.commands.executeCommand("workbench.action.reloadWindow");
        }
    });
}

const globalCacheLocation = "cache";
const workspaceCacheLocation = "cache";

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}

function chosenTrace(): Trace {
    let config = vscode.workspace.getConfiguration("autousing").get("trace.server");
    switch (config) {
        case "off": return Trace.Off;
        case "messages": return Trace.Messages;
        case "verbose": return Trace.Verbose;
    }
}