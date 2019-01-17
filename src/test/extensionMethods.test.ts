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

    test("Should show extension methods", async () => {
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

    test("Should show extension methods for full qualified paths", async () => {
        let completionList = await complete("ShouldExtendFullPaths.cs", 7, 14);
        assertContains(completionList, "Select");
    });

    test("Should not show extension methods for static types", async () => {
        let [completionList,doc] = await completeWithData("ShouldNotShowExtensionsForStatic.cs", 6, 17);
        assertNone(completionList.items, (completion) => completion.kind === vscode.CompletionItemKind.Reference);
    });

});