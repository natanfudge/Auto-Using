import { complete } from "./extension.e2e.test";
import { activateCSharpExtension, assertContains, getTestPlaygroundDirUri, activateExtension } from "./testUtil";
import * as vscode from "vscode";

suite(`Extension Methods e2e tests`, () => {
    // test("Provides extension methods", async () => {
    //     let completionList = await complete("ShouldShowExtensions.cs", 2, 2);
    //     assertContains(completionList, "Select");
    // });

    suiteSetup(async () => {
        // let wait1 =  vscode.commands.executeCommand("vscode.openFolder", getTestPlaygroundDirUri());
        let wait1 = activateExtension();
        let wait2 = activateCSharpExtension();
        await wait1;
        await wait2;
        // await wait1;
    });

    test.only("Provides extension methods for a primitive", async () => {
        // await vscode.commands.executeCommand("vscode.openFolder", getTestPlaygroundDirUri());

        let completionList = await complete("ShouldShowPrimitiveExtensions.cs", 2, 2);
        assertContains(completionList, "Normalize");
    });

    // test("Provides extension methods of the object's baseclasses", async () => {
    //     let completionList = await complete("ShouldShowBaseExtensions.cs", 2, 2);
    //     assertContains(completionList, "OfType");
    // });

    // test("Provides extension methods for generic objects", async () => {
    //     let completionList = await complete("ShouldShowGenericExtensions.cs", 2, 2);
    //     assertContains(completionList, "Select");
    // });

    // suiteTeardown(() =>{
    //     vscode.commands.executeCommand("vscode.closeEditor");
    // });
});