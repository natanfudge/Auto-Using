// if (this.justCheckingOther) return [];
// this.justCheckingOther = true;


// let currentWordRange = document.getWordRangeAtPosition(position);
// let currentWord = document.getText(currentWordRange);

// let hackedCompletions;

// let intEdit = async textEdit => {
// 	textEdit.replace(currentWordRange, "int");
// };

// let returnEdit = async textEdit => {
// 	textEdit.replace(document.getWordRangeAtPosition(position), currentWord);
// };



// let editor = vscode.window.activeTextEditor;
// await editor.edit(intEdit);
// hackedCompletions = <vscode.CompletionList>(await vscode.commands.executeCommand("vscode.executeCompletionItemProvider", document.uri, position, " "));
// await editor.edit(returnEdit);



// this.justCheckingOther = false;

////OMNI SHARP SERVER
// const TypeLookup = '/typelookup';
// let request = createRequest(document,position);
// let response = await this.server.makeRequest(TypeLookup, request, token);