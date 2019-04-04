import * as vscode from "vscode";
import { openTest } from "./testUtil";
import { SORT_CHEAT } from "../extension";



export class DirectCompletionTestHelper {
    constructor(private completionProvider: vscode.CompletionItemProvider) { }
    public async  directlyComplete(testName: string, line: number, character: number): Promise<string[]> {
        let completions = (await this.directlyCompleteWithData(testName, line, character))[0];
        return completions.map(item => removeCheat(item.label));
    }

    public async  directlyCompleteWithData(testName: string, line: number, character: number):
        Promise<[vscode.CompletionItem[], vscode.TextDocument]> {
        let doc = await openTest(testName);
        let pos = new vscode.Position(line, character);
        let token = new vscode.CancellationTokenSource().token;
        let completionContext: vscode.CompletionContext = { triggerCharacter: ".", triggerKind: vscode.CompletionTriggerKind.Invoke };
        let completions = await this.completionProvider.provideCompletionItems(doc, pos, token, completionContext) as vscode.CompletionItem[];

        return [completions, doc];
    }
}



export function removeCheat(label: string) {
    return label.replace(SORT_CHEAT, "");
}

/**
 * The line and character start with an index of 0. 
 */
export async function complete(testName: string, line: number, character: number): Promise<string[]> {
    return (await completeWithData(testName, line, character))[0].items.map(item => removeCheat(item.label));
}

export async function completeWithData(testName: string, line: number, character: number): Promise<[vscode.CompletionList, vscode.TextDocument]> {
    let doc = await openTest(testName);
    let completions = (await vscode.commands.executeCommand("vscode.executeCompletionItemProvider",
        doc.uri, new vscode.Position(line, character), "."));

    let char = doc.getText(new vscode.Range(new vscode.Position(line, character), new vscode.Position(line, character + 1)));

    return [<vscode.CompletionList>completions, doc];
}