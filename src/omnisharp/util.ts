// import { Request } from "./interfaces";
// import * as vscode from "vscode";

// export function createRequest<T extends Request>(document: vscode.TextDocument, where: vscode.Position | vscode.Range, includeBuffer: boolean = false): T {

// 	let Line: number, Column: number;

// 	if (where instanceof vscode.Position) {
// 		Line = where.line + 1;
// 		Column = where.character + 1;
// 	} else if (where instanceof vscode.Range) {
// 		Line = where.start.line + 1;
// 		Column = where.start.character + 1;
// 	}

// 	// for metadata sources, we need to remove the [metadata] from the filename, and prepend the $metadata$ authority
// 	// this is expected by the Omnisharp server to support metadata-to-metadata navigation
// 	let fileName = document.uri.scheme === "omnisharp-metadata" ?
// 		`${document.uri.authority}${document.fileName.replace("[metadata] ", "")}` :
// 		document.fileName;

// 	let request: Request = {
// 		FileName: fileName,
// 		Buffer: includeBuffer ? document.getText() : undefined,
// 		Line,
// 		Column
// 	};

// 	return <T>request;
// }
