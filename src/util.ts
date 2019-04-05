import { dirname, extname, sep, join } from "path";
import { readdirSync, unwatchFile, statSync } from "fs";
const parentfinder = require('find-parent-dir');
const findupglob = require('find-up-glob');
const glob = require("glob");
import * as vscode from "vscode";


export function flatten<T>(arr: T[][]): T[] {
    return arr.reduce((acc, val) => acc.concat(val), []);
}


const projectExtension = ".csproj";

export function getAllProjectFiles(): string[] {
    let workspaceFolders = vscode.workspace.workspaceFolders;
    if(workspaceFolders === undefined) return [];
    let files =  flatten(workspaceFolders.map(folder => findByExtensionDeep(folder.uri.path.slice(1),projectExtension))); 
    return files;
}

function findByExtensionDeep(folder: string, extension: string)  : string[]{
    // let projectFiles = glob.sync(folder + '/**/*.' + projectExtension);
    // return projectFiles;
    return recFindByExtLogic(folder, extension, undefined, undefined);
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

