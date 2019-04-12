import { test, suite, suiteSetup } from 'mocha';
import * as vscode from "vscode";
import { activateExtension, assertContains, assertNone, assertNotContains, assertSize, assertStringContains, forServerToBeReady,
     assertNotStringContains as assertStringNotContains } from './testUtil';
import { complete, completeWithData, removeCheat } from './TestCompletionUtil';

describe(`CompletionProvider Types Tests`, () => {


    before(async () => {
        await activateExtension();
        await forServerToBeReady();
    });

    it("Should show completions", async () => {
        let completionList = await complete("ShouldShow.cs", 1, 5);
        assertContains(completionList, "File");

    });

    it("Should not show completions when not needed", async () => {
        let [completionList, doc] = await completeWithData("ShouldNotShow.cs", 1, 4);
        assertNone(completionList.items, (completion) => completion.kind === vscode.CompletionItemKind.Reference);
    });

    it("Should filter out already used namespaces", async () => {
        let completionList = await complete("ShouldFilterOut.cs", 3, 3);
        assertNotContains(completionList, "File");
    });

    // it("Should filter out only specific completions which have used namespaces", async () => {
    //     let [completions] = await completeWithData("ShouldFilterSome.cs", 6, 14);
    //     completions.items.sort((item1, item2) => item1.label.localeCompare(item2.label));
    //     let files = completions.items.filter(c => removeCheat(c.label) === "File");



    //     let file = files.filter(completion => completion.documentation === undefined) [0];

    //     assertStringContains(file.detail!, "System.Net");
    //     assertStringNotContains(file.detail!, "System.IO");
    // })

    it("Should combine types of the same name", async () => {
        let [completionList] = await completeWithData("ShouldCombine.cs", 1, 6);
        completionList.items.sort((item1, item2) => item1.label.localeCompare(item2.label));
        let enumerables = completionList.items.filter(c => removeCheat(c.label) === "IEnumerable");
        assertSize(enumerables, 1);

        let enumerable = enumerables[0];

        assertStringContains(enumerable.detail!, "System.Collections");
        assertStringContains(enumerable.detail!, "System.Collections.Generic");
    });

    it("Should show types of a library", async () => {
        let completionList = await complete("ShouldShowLibraryType.cs", 4, 12);
        assertContains(completionList, "JsonConvert");
    });

    it("Should not show types of a not imported library", async () => {
        let completionList = await complete("ShouldNotShowOtherLibraryType.cs", 4, 12);
        assertNotContains(completionList, "MidiFile");
    });

    it("Should work despite being after a comment dot", async () => {
        let completionList = await complete("ShouldIgnoreComment.cs", 7, 8);
        assertContains(completionList, "Binder");
    });

    it("Should show completions even where there is no space before", async () => {
        let completionList = await complete("ShouldShowWithoutSpace.cs", 6, 20);
        assertContains(completionList, "File");
    });

    it("Should show completions after the 'this' keyword", async () => {
        let completionList = await complete("ShouldCompleteAfterThis.cs", 6, 37);
        assertContains(completionList, "IEnumerable");
    });

    it("Should not throw an error when there is a blank line nearby", async () => {
        let completionList = await complete("ShouldNotCrashWhenEmptyLine.cs", 7, 4);
    });




});

