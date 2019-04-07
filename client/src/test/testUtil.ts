import * as vscode from "vscode";
import * as colors from "colors";
import { writeFileSync, readFileSync } from "fs";
import { testHelper } from "../extension";

export const extensionLocation = "C:\\Users\\natan\\Desktop\\Auto-Using-Git";

export async function activateExtension(): Promise<void> {
    const ext = vscode.extensions.getExtension("fudge.auto-using")!;

    if (!ext.isActive) {
        await ext.activate();
    }

}

export async function activateCSharpExtension(): Promise<void> {
    const csharpExtension = vscode.extensions.getExtension("ms-vscode.csharp")!;

    if (!csharpExtension.isActive) {
        await csharpExtension.activate();
    }

    await csharpExtension.exports.initializationFinished();

}

export async function forServerToBeReady(): Promise<void> {
    let helper = testHelper;

    //@ts-ignore
    let client = helper.client;
    //@ts-ignore
    let ready = testHelper.started;
    if (ready) return;
    else await client.onReady();
}

class AssertionError extends Error {
    constructor(str: string) {
        super("Assertion Error:\n" + str + ".");
    }
}

export function assertContains<T>(arr: Array<T>, element: T): void {
    if (!arr.includes(element)) {
        let str = "Expected array to contain: "
            + colors.green(JSON.stringify(element)) + "\n But actually contains: " + colors.red(JSON.stringify(arr));

        throw new AssertionError(str);
    }
}

export function assertStringContains(str: string, substring: string): void {
    if (!str.includes(substring)) {
        let error = "Expected string to contain : ".white + colors.green(substring) + 
            "\nBut is actually " + str.red;
        throw new AssertionError(error);
    }
}


export function assertNotStringContains(str: string, substring: string): void {
    if (str.includes(substring)) {
        let error = "Expected string to not contain : " + colors.red(substring) +
            "But actually does contain it: " + str;
        throw new AssertionError(error);
    }
}

export function assertInFirst<T>(amount: number, arr: Array<T>, element: T): void {
    let subArray = arr.slice(0, amount);

    if (!subArray.includes(element)) {
        let error = `Expected first one of the first ${amount} elements in array to be ${JSON.stringify(element).green}, \n
        But they are actually ${JSON.stringify(subArray).red} 
        `;

        throw new AssertionError(error);
    }


}

export function assertSize<T>(arr: Array<T>, size: number): void {
    if (arr.length !== size) throw new AssertionError(`Array size is ${arr.length}, expected: ${size}`);
}

export function assertNotContains<T>(arr: Array<T>, element: T): void {
    for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        if (el === element) {
            throw new AssertionError(`Expected array to not contain '${element}' but it contains it in index ${i}`);
        }
    }
}

export function assertFalse(bool: boolean): void {
    assertBool(bool, false);
}

export function assertTrue(bool: boolean): void {
    assertBool(bool, true);
}

function assertBool(checking: boolean, trueOrFalse: boolean): void {
    if (checking !== trueOrFalse) {
        throw new AssertionError(`Expected value to be ${JSON.stringify(trueOrFalse).green} but is actually ${JSON.stringify(!trueOrFalse).red}`);
    }
}

/**
 * Asserts that none of the elements in the array return true to the specified attribute
 */
export function assertNone<T>(arr: Array<T>, attribute: (element: T) => boolean) {
    for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        if (attribute(el)) {
            throw new AssertionError(`Expected none of the elements to return true to ${attribute.toString().green},
             but the element ${JSON.stringify(el).red} at index ${i.toString().red} does return true`);
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

export function getTestPlaygroundDirUri(): vscode.Uri {
    return vscode.Uri.file(goBackFolders(__dirname, 2) + playgroundDir);
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

