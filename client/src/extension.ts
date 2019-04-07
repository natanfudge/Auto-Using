/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import * as vscode from "vscode"

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind,
    Trace
} from 'vscode-languageclient';
import { join } from 'path';
import { TestHelper, Completion, getStoredCompletions, completionCommon, StoredCompletion, addUsing, storeCompletion, SetupWorkspaceRequest, getAllProjectFiles, HoverRequest, getHoverString } from './util';

const debugging = false;
const debugServerLocation = join("server", "AutoUsing", "bin", "Debug", "netcoreapp2.1", "AutoUsing.dll");
const releaseServerLocation = join("server", "AutoUsing", "bin", "Debug", "netcoreapp2.1", "publish", "AutoUsing.dll");
const relativeServerLocation = debugging? debugServerLocation : releaseServerLocation;
const hoverRequest = "custom/hoverRequest";
const dotnetExe = 'dotnet';
const HANDLE_COMPLETION = "custom/handleCompletion";
export let testHelper: TestHelper;
let client: LanguageClient;
export function activate(context: vscode.ExtensionContext) {
	// The server is implemented in node
	let serverModule = context.asAbsolutePath(
		relativeServerLocation
	);
	let commandDisposable = vscode.commands.registerCommand(HANDLE_COMPLETION, async (completion: Completion) => {
        if (completion.Namespaces.length > 1) {

            let completions = getStoredCompletions(context);


            let namespacesSorted = await Promise.all(completion.Namespaces.sort((n1, n2) => {
                let firstPrio = completionCommon(new StoredCompletion(completion.Name, n1), completions);
                let secondPrio = completionCommon(new StoredCompletion(completion.Name, n2), completions);

                if (firstPrio && !secondPrio) return -1;
                if (!firstPrio && secondPrio) return 1;
                return n1.localeCompare(n2);

            }));


            vscode.window.showQuickPick(namespacesSorted).then(pick => addUsing(pick, context, completion));
        } else {
            storeCompletion(context, new StoredCompletion(completion.Name, completion.Namespaces[0]));
        }
    });

	let setup: SetupWorkspaceRequest = {
        extensionDir: context.extensionPath,
        projects: getAllProjectFiles(),
        workspaceStorageDir: context.storagePath!,
        globalStorageDir: context.globalStoragePath
    }

	var message = JSON.stringify(setup);

	let serverOptions: ServerOptions = {
        run: { command: dotnetExe, args: [serverModule, message] },
        debug: { command: dotnetExe, args: [serverModule, message] },
	}
	
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

    }


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
            if(result == undefined) return undefined;
            let str : string = result;
            return str;
        });

    });

    client.trace = chosenTrace();
    let clientDisposable = client.start();

    // Push the disposable to the context's subscriptions so that the
    // client can be deactivated on extension deactivation
    context.subscriptions.push(clientDisposable,commandDisposable);
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

function chosenTrace() : Trace{
    let config = vscode.workspace.getConfiguration("autousing").get("trace.server");
    switch(config){
        case "off": return Trace.Off;
        case "messages": return Trace.Messages;
        case "verbose" : return Trace.Verbose;
    }
}