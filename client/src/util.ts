import { readFileSync, writeFile, existsSync, mkdirSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import * as vscode from "vscode"
import { LanguageClient } from "vscode-languageclient";

export const SORT_CHEAT = "\u200B";
export class TestHelper {

    constructor(private client: LanguageClient, private started: boolean = false) { }
}

export interface SetupWorkspaceRequest {
    projects: string[];
    workspaceStorageDir: string;
    globalStorageDir: string;
    extensionDir: string;

}

export interface HoverRequest {
    pos: vscode.Position;
    filePath: string;
}
export interface Completion {
    Name: string;
    Namespaces: string[];
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
export function getStoredCompletions(context: vscode.ExtensionContext): StoredCompletion[] {
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
export function storeCompletion(context: vscode.ExtensionContext, completion: StoredCompletion) {
    let existingStorage = getStoredCompletions(context);
    existingStorage.push(completion);
    let file = CommonCompletionLocation(context);
    writeFile(file, JSON.stringify(existingStorage), () => null);


}

/**
 * Checks if the required files for the completions exist in the system. If not, it creates them and return false.
 */
export function storageInvalid(file: string, dir: string): boolean {
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
export function addUsing(pick: string | undefined, context: vscode.ExtensionContext, completion: Completion): void {
    if (typeof pick === "undefined") return;
    // Remove invisible unicode char
    if (pick[0] === SORT_CHEAT) pick = pick.substr(1, pick.length);

    storeCompletion(context, new StoredCompletion(completion.Name, pick));

    let editBuilder = (textEdit: any) => {
        textEdit.insert(new vscode.Position(0, 0), `using ${pick};\n`);
    };

    vscode.window.activeTextEditor!.edit(editBuilder);
}

export function InitializeStorage(location: string): void {
    writeFileSync(location, "[]");
}

// import path = require('path');
// import { existsSync, mkdirSync, writeFileSync, readFileSync, writeFile } from 'fs';
const CommonCompletionLocation = (context: vscode.ExtensionContext) => join(CommonCompletionDirectory(context), "commonCompletions.json");
const CommonCompletionDirectory = (context: vscode.ExtensionContext) => join(context.globalStoragePath!, "completions");


const typeInfoIdentifier = "```csharp\n";


/**
 * Gets the string that is in the hover result provided by the C# extension in a given position and file uri.
 */
export async function getHoverString(uri: vscode.Uri, position: vscode.Position): Promise<string | undefined> {
    // Get the hover info of the variable from the C# extension
    let hover = <vscode.Hover[]>(await vscode.commands.executeCommand("vscode.executeHoverProvider", uri, position));
    if (hover.length === 0) return undefined;

    let hovers = hover[0].contents;
    let typeHover = <{ language: string; value: string }>hovers.find(hover => {
        let cast = <{ language: string; value: string }>hover;
        return cast.value.startsWith(typeInfoIdentifier);
    });

    return typeHover.value;
}

export class StoredCompletion {
    constructor(public label: string, public namespace: string) { }
}

const projectExtension = ".csproj";

export function getAllProjectFiles(): string[] {
    let workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders === undefined) return [];
    let files = flatten(workspaceFolders.map(folder => findByExtensionDeep(folder.uri.path.slice(1), projectExtension)));
    return files;
}





export function flatten<T>(arr: T[][]): T[] {
    return arr.reduce((acc, val) => acc.concat(val), []);
}




export function findByExtensionDeep(folder: string, extension: string): string[] {
    // let projectFiles = glob.sync(folder + '/**/*.' + projectExtension);
    // return projectFiles;
    let result =  recFindByExtLogic(folder, extension, undefined, undefined);
    return result;
}

function recFindByExtLogic(folder: string, extension: string, files: string[] | undefined, result: string[] | undefined): string[] {
    files = files || readdirSync(folder);
    result = result || [];


    files.forEach(
        (file) => {
            let newFolder = join(folder, file)
            if (statSync(newFolder).isDirectory()) {
                result = recFindByExtLogic(newFolder, extension, readdirSync(newFolder), result);
            }
            else {
                if (file.substr(-1 * (extension.length)) === extension) {
                    result!.push(newFolder);
                }
            }
        }
    );
    return result;
}