import { complete } from "./extension.e2e.test";
import { activateCSharpExtension, assertContains, getTestPlaygroundDirUri, activateExtension } from "./testUtil";
import * as vscode from "vscode";

suite.only(`Extension Methods e2e tests`, () => {


    suiteSetup(async () => {
        let wait1 = activateExtension();
        let wait2 = activateCSharpExtension();
        await wait1;
        await wait2;
    });

    test("Provides extension methods", async () => {
        let completionList = await complete("ShouldShowExtensions.cs", 3, 2);
        assertContains(completionList, "Select");
    });

    test("Provides extension methods for a primitive", async () => {
        let completionList = await complete("ShouldShowPrimitiveExtensions.cs", 2, 2);
        assertContains(completionList, "AsSpan");
    });

    test("Provides extension methods of the object's baseclasses", async () => {
        let completionList = await complete("ShouldShowBaseExtensions.cs", 3, 2);
        assertContains(completionList, "OfType");
    });

    test("Provides extension methods for generic objects", async () => {
        let completionList = await complete("ShouldShowGenericExtensions.cs", 3, 2);
        assertContains(completionList, "Select");
    });

});