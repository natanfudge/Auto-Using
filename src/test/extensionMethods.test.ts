import { activateCSharpExtension, assertContains, getTestPlaygroundDirUri, activateExtension } from "./testUtil";
import * as vscode from "vscode";
import { complete } from "./TestCompletionUtil";

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

});