// import * as vscode from "vscode";
// import { provideCompletionItems } from "./CompletionInstanceFUCK";
// import { StoredCompletion, COMPLETION_STORAGE } from "./extension";
// import { AutoUsingServer } from "./server/AutoUsingServer";

// const shouldLogTotalPerformance = true;
// export const maxCompletionAmount = 100;
// export class CompletionProvider implements vscode.CompletionItemProvider {

// 	public constructor(private extensionContext: vscode.ExtensionContext, private server: AutoUsingServer) { }
// 	public async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken,
// 		context: vscode.CompletionContext): Promise<vscode.CompletionList> {
// 		try {
// 			// In case projects have not been set up yet
// 			if (!this.server.isReady()) return noCompletions();
			
// 			let startTime = Date.now();
// 			let result = await provideCompletionItems(document, position, token, context, this.extensionContext, this.server);
// 			logTotalPerformance(startTime);
// 			// let incomplete = result.length > maxCompletionAmount;
// 			// // let items = incomplete ? result.slice(0, maxCompletionAmount) : result;
// 			return result;
// 		} catch (e) {
// 			console.log(e.stack);
// 			throw new Error(e);
// 		}
// 	}

// }

// function noCompletions() : Promise<vscode.CompletionList>{
// 	return new Promise((resolve, reject) => resolve(new vscode.CompletionList([])))
// }

// function logTotalPerformance(startTime: number) {
// 	if (shouldLogTotalPerformance) {
// 		let timePassed = Date.now() - startTime;
// 		console.log("Total completion provider time: " + timePassed);
// 	}
// }

// /**
//  * Get the list of completions that are commonly used by the user and are therefore stored in the system.
//  */
// export function getStoredCompletions(context: vscode.ExtensionContext): StoredCompletion[] {
// 	let completions = context.globalState.get<StoredCompletion[]>(COMPLETION_STORAGE);

// 	if (typeof completions === "undefined") return [];
// 	return completions;
// }


