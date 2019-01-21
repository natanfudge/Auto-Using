import * as vscode from "vscode";
import { provideCompletionItems } from "./CompletionInstance";
import { Completion, COMPLETION_STORAGE } from "./extension";

export class CompletionProvider implements vscode.CompletionItemProvider {

	public constructor(private extensionContext: vscode.ExtensionContext) { }
	public async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken,
		 context: vscode.CompletionContext): Promise<vscode.CompletionItem[]> {
		try {
			let result = await provideCompletionItems(document, position, token, context, this.extensionContext);
			return result;
		} catch (e) {
			console.log(e.stack);
			throw new Error(e);
		}
	}

}

export function getStoredCompletions(context: vscode.ExtensionContext): Completion[] {
	let completions = context.globalState.get<Completion[]>(COMPLETION_STORAGE);

	if (typeof completions === "undefined") return [];
	return completions;
}