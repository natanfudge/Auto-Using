import { dirname, extname, sep, join } from "path";
import { readdirSync, unwatchFile, statSync } from "fs";
const parentfinder = require('find-parent-dir');
const findupglob = require('find-up-glob');
const glob = require("glob");
import * as vscode from "vscode";
import * as cp from "child_process";
import * as os from "os";

export function flatten<T>(arr: T[][]): T[] {
    return arr.reduce((acc, val) => acc.concat(val), []);
}

const debugging = false;

// Log only when debugging
export function AUDebug(str: string): void {
    if (debugging) console.log(str);
}
const projectExtension = ".csproj";
export function getProjectRootDirOfFilePath(filePath: string): string {

    let projectrootdir: string = parentfinder.sync(dirname(filePath), 'project.json');
    if (projectrootdir === null) {
        let csprojfiles = findupglob.sync('*' + projectExtension, { cwd: dirname(filePath) });
        if (csprojfiles === null) {
            throw new Error("Could not find project files.");
        }
        projectrootdir = dirname(csprojfiles[0]);
    }

    return projectrootdir;
}

export function getFullPathToProjectOfFile(projectDir: string) {
    return projectDir + sep + getProjectName(projectDir) + projectExtension;
}

export function getProjectName(filePath: string) {
    let projectDir = getProjectRootDirOfFilePath(filePath);
    let files = readdirSync(projectDir).filter((file) => extname(file).toLowerCase() === projectExtension);
    if (files.length > 1) throw new Error("Did not expect more than 1 project file in directory!");
    // Remove extension
    return files[0].split('.').slice(0, -1).join('.');
}

export function getAllProjectFiles(): string[] {
    let workspaceFolders = vscode.workspace.workspaceFolders;
    if(workspaceFolders === undefined) return [];
    // Slice(1) to remove weird '/' at the start of path
    let files =  flatten(workspaceFolders.map(folder => findByExtensionDeep(folder.uri.path.slice(1),projectExtension))); 
    return files;
    // for(let workspace in vscode.workspace.workspaceFolders){

    // }
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


// Function from omnisharp to get the ids of the child process to kill it when the extension is deactivated. 
export async function getUnixChildProcessIds(pid: number): Promise<number[]> {
    return new Promise<number[]>((resolve, reject) => {
        let ps = cp.exec('ps -A -o ppid,pid', (error, stdout, stderr) =>
        {
            if (error) {
                return reject(error);
            }

            if (stderr) {
                return reject(stderr);
            }

            if (!stdout) {
                return resolve([]);
            }

            let lines = stdout.split(os.EOL);
            let pairs = lines.map(line => line.trim().split(/\s+/));

            let children = [];

            for (let pair of pairs) {
                let ppid = parseInt(pair[0]);
                if (ppid === pid) {
                    children.push(parseInt(pair[1]));
                }
            }

            resolve(children);
        });

        ps.on('error', reject);
    });
}