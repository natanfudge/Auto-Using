// import { activateExtension, assertNotContains, assertSize, assertStringContains, assertContains, assertNone, forServerToBeReady } from './testUtil';
// import { complete, completeWithData, removeCheat } from './TestCompletionUtil';
// import { test, suite, suiteSetup } from 'mocha';
// import * as vscode from "vscode";
// import { testHelper } from '../extension';

// suite(`CompletionProvider Types Tests`, () => {


//     suiteSetup(async () => {
//         await activateExtension();
//         await forServerToBeReady();
//     });

//     test("Should show completions", async () => {
//         let completionList = await complete("ShouldShow.cs", 1, 5);
//         assertContains(completionList, "File");

//     });

//     test("Should not show completions when not needed", async () => {
//         let [completionList, doc] = await completeWithData("ShouldNotShow.cs", 1, 4);
//         assertNone(completionList.items, (completion) => completion.kind === vscode.CompletionItemKind.Reference);
//     });

//     test("Should filter out already used namespaces", async () => {
//         let completionList = await complete("ShouldFilterOut.cs", 4, 4);
//         assertNotContains(completionList, "File");
//     });

//     test("Should combine types of the same name", async () => {
//         let [completionList] = await completeWithData("ShouldCombine.cs", 1, 6);
//         completionList.items.sort((item1, item2) => item1.label.localeCompare(item2.label));
//         let enumerables = completionList.items.filter(c => removeCheat(c.label) === "IEnumerable");
//         assertSize(enumerables, 1);

//         let enumerable = enumerables[0];

//         assertStringContains(enumerable.detail!, "System.Collections");
//         assertStringContains(enumerable.detail!, "System.Collections.Generic");
//     });

//     test("Should show types of a library", async () => {
//         let completionList = await complete("ShouldShowLibraryType.cs", 4, 12);
//         assertContains(completionList, "JsonConvert");
//     });

//     test("Should not show types of a not imported library", async () => {
//         let completionList = await complete("ShouldNotShowOtherLibraryType.cs", 4, 12);
//         assertNotContains(completionList, "MidiFile");
//     });

//     test("Should work despite being after a comment dot", async () => {
//         let completionList = await complete("ShouldIgnoreComment.cs", 7, 8);
//         assertContains(completionList,"Binder");
//     });

//TODO: Test types after the 'this' keyword, it doesn't seem to be working.



// });

