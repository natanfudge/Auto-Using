import * as vscode from "vscode";
import { provideCompletionItems } from "./CompletionInstance";
import { Completion, COMPLETION_STORAGE } from "./extension";
import { AutoUsingServer } from "./server/AutoUsingServer";

const shouldLogTotalPerformance = true;
export const maxCompletionAmount = 100;
export class CompletionProvider implements vscode.CompletionItemProvider {



	public constructor(private extensionContext: vscode.ExtensionContext, private server: AutoUsingServer) { }
	public async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken,
		context: vscode.CompletionContext): Promise<vscode.CompletionList> {
		try {
			let startTime = Date.now();
			let result = await provideCompletionItems(document, position, token, context, this.extensionContext, this.server);
			logTotalPerformance(startTime);
			// let incomplete = result.length > maxCompletionAmount;
			// // let items = incomplete ? result.slice(0, maxCompletionAmount) : result;
			return result;
		} catch (e) {
			console.log(e.stack);
			throw new Error(e);
		}
	}

}

function logTotalPerformance(startTime: number) {
	if (shouldLogTotalPerformance) {
		let timePassed = Date.now() - startTime;
		console.log("Total completion provider time: " + timePassed);
	}
}

export function getStoredCompletions(context: vscode.ExtensionContext): Completion[] {
	let completions = context.globalState.get<Completion[]>(COMPLETION_STORAGE);

	if (typeof completions === "undefined") return [];
	return completions;
}


