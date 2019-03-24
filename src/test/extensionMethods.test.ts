import { activateCSharpExtension, assertContains, getTestPlaygroundDirUri, activateExtension, assertNone } from "./testUtil";
import * as vscode from "vscode";
import { complete, completeWithData } from "./TestCompletionUtil";

suite(`CompletionProvider Extension Method Tests`, () => {


    suiteSetup(async () => {
        let wait1 = activateExtension();
        let wait2 = activateCSharpExtension();
        await wait1;
        await wait2;
    });

    test.only("Should show extension methods", async () => {
        let completionList = await complete("ShouldShowExtensions.cs", 3, 2);
        assertContains(completionList, "Select");
    });

    test("Should show extension methods for primitive types", async () => {
        let completionList = await complete("ShouldShowPrimitiveExtensions.cs", 2, 2);
        assertContains(completionList, "AsSpan");
    });

    test("Should show extension methods of base classes of the type", async () => {
        let completionList = await complete("ShouldShowBaseExtensions.cs", 3, 2);
        assertContains(completionList, "OfType");
    });

    test("Should show extension methods for generic types", async () => {
        let completionList = await complete("ShouldShowGenericExtensions.cs", 3, 2);
        assertContains(completionList, "Select");
    });

    test("Should show extension methods for fully qualified paths", async () => {
        let completionList = await complete("ShouldExtendFullPaths.cs", 7, 14);
        assertContains(completionList, "Select");
    });

    test("Should not show extension methods for static types", async () => {
        let [completionList,doc] = await completeWithData("ShouldNotShowExtensionsForStatic.cs", 6, 17);
        assertNone(completionList.items, (completion) => completion.kind === vscode.CompletionItemKind.Reference);
    });

    test("Should show extension methods after methods calls with parameters",async() =>{
        let completionList = await complete("ShouldShowExtensionsAfterParams.cs", 9, 43);
        assertContains(completionList, "ToImmutableArray");
    });

    test("Should show extension methods after parentheses", async() =>{
        let completionList = await complete("ShouldShowExtendAfterParentheses.cs", 7, 20);
        assertContains(completionList, "Select");
    });

    test("Should show extension methods even when there are spaces between the dot and other text", async() =>{
        let completionList = await complete("ShouldShowExtensionsForSpaces.cs", 7, 16);
        assertContains(completionList, "Select");
    });

    test("Should show extension methods for arrays", async() =>{
        let completionList = await complete("ShouldShowExtensionsForArray.cs", 6, 14);
        assertContains(completionList, "Select");
    });

});