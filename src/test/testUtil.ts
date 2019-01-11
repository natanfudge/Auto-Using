import * as vscode from "vscode";
import * as colors from "colors";
import { writeFileSync, readFileSync } from "fs";

export async function activateExtension(): Promise<void> {
    const ext = vscode.extensions.getExtension("Fudge.auto-using")!;

    if (!ext.isActive) {
        await ext.activate();
    }

}

export function assertContains<T>(arr: Array<T>, element: T): void {
    if (!arr.includes(element)) {
        let str = "Assertion Error:\n Expected array to contain: "
            + colors.green(JSON.stringify(element)) + "\n But actually contains: " + colors.red(JSON.stringify(arr));

        throw new Error(str);
    }
}

export function assertStringContains(str: string, substring: string): void {
    if (!str.includes(substring)) {
        let error = "Assertion Error: \n Expected string to contain : " + colors.green(str) +
            "But is actually " + substring;
        throw new Error(error);
    }
}

export function assertInFirst<T>(amount: number, arr: Array<T>, element: T) {
    let subArray = arr.slice(0, amount);

    if (!subArray.includes(element)) {
        let error = `Assertion Error : \n Expected first one of the first ${amount} elements in array to be ${JSON.stringify(element).green}, \n
        But they are actually ${JSON.stringify(subArray).red} 
        `;

        throw new Error(error);
    }


}

export function assertSize<T>(arr: Array<T>, size: number): void {
    if (arr.length !== size) throw new Error(`Assertion Error:\n Array size is ${arr.length}, expected: ${size}`);
}

export function assertNotContains<T>(arr: Array<T>, element: T): void {
    for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        if (el === element) {
            throw new Error(`Assertion Error: \n Expected array to not contain '${element}' but it contains it in index ${i}`);
        }
    }
}

export function sleep(milliseconds: number): void {
    let e = new Date().getTime() + (milliseconds);
    while (new Date().getTime() <= e) { }
}

const assetDir = "/src/test/assets";
const playgroundDir = "/src/test/playground";


function getTestAssetPath(testName: string): string {
    return goBackFolders(__dirname, 2) + assetDir + "/" + testName;
}

function getTestPlaygroundPath(testName: string): string {
    return goBackFolders(__dirname, 2) + playgroundDir + "/" + testName;
}

function getTestPlaygroundUri(testname: string): vscode.Uri {
    return vscode.Uri.file(getTestPlaygroundPath(testname));
}

export async function openTest(testName: string): Promise<vscode.TextDocument> {

    // Move test to playground
    await writeFileSync(getTestPlaygroundPath(testName), await readFileSync(getTestAssetPath(testName)));

    let doc = await vscode.workspace.openTextDocument(getTestPlaygroundUri(testName));
    await vscode.window.showTextDocument(doc);

    return doc;


}

function goBackFolders(folder: string, times: number): string {
    let newStringEnd: number;
    for (newStringEnd = folder.length - 1; newStringEnd--; newStringEnd >= 0) {
        let char = folder[newStringEnd];

        if (char === "/" || char === "\\") times--;
        if (times <= 0) break;
    }

    return folder.substr(0, newStringEnd);
}

