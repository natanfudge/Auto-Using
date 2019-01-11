import * as vscode from 'vscode';
import * as path from "path";
import { activateExtension, assertContains, sleep, openTest, assertNotContains, assertSize, assertStringContains } from './testUtil';
import * as assert from "assert";
import { SORT_CHEAT, Reference } from '../CompletionProvider';
import { wipeStoredCompletions } from '../extension';

suite(`Auto-Using e2e tests`, () => {

    suiteSetup(async () => {
        await activateExtension();
    });

    test("Completes when needed", async () => {
        let completionList = await complete("ShouldShow.cs", 1, 4);
        assertContains(completionList, "File");
    });

    test("Doesn't Complete when not needed", async () => {
        let completionList = await complete("ShouldNotShow.cs", 1, 4);
        assertNotContains(completionList, "File");
    });

    test("Filters out references that you are using", async () => {
        let completionList = await complete("ShouldFilterOut.cs", 4, 4);
        assertNotContains(completionList, "File");
    });

    test("Combines multiple references of the same name", async () => {
        let [completionList] = await completeWithData("ShouldCombine.cs", 1, 6);
        completionList.items.sort((item1, item2) => item1.label.localeCompare(item2.label));
        let enumerables = completionList.items.filter(c => removeCheat(c.label) === "IEnumerable");
        assertSize(enumerables, 1);

        let enumerable = enumerables[0];

        assertStringContains(enumerable.detail!, "System.Collections");
        assertStringContains(enumerable.detail!, "System.Collections.Generic");
    });
    

});

export function removeCheat(label: string) {
    return label.replace(SORT_CHEAT, "");
}

export async function complete(testName: string, line: number, character: number): Promise<string[]> {
    return (await completeWithData(testName, line, character))[0].items.map(item => removeCheat(item.label));
}

export async function completeWithData(testName: string, line: number, character: number): Promise<[vscode.CompletionList, vscode.TextDocument]> {
    let doc = await openTest(testName);
    let completions = <vscode.CompletionList>(await vscode.commands.executeCommand("vscode.executeCompletionItemProvider",
        doc.uri, new vscode.Position(line, character), " "));

    let char = doc.getText(new vscode.Range(new vscode.Position(line,character),new vscode.Position(line,character + 1)));

    return [completions, doc];
}