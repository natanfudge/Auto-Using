//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node

import { activateExtension, assertInFirst, openTest, assertContains } from './testUtil';
import * as vscode from "vscode";
// import { testHelper, COMPLETION_STORAGE, Completion } from '../extension';
import * as assert from "assert";
import { Completion, COMPLETION_STORAGE, testHelper, addUsing, storeCompletion } from '../extension';
import * as extension from "../extension";
import { completeWithData, complete, DirectCompletionTestHelper } from './TestCompletionUtil';
import { CompletionProvider } from '../CompletionProvider';


// Defines a Mocha test suite to group tests of similar kind together
suite("CompletionProvider References Context Tests", function () {

    

    let context: vscode.ExtensionContext;
    let helper: DirectCompletionTestHelper;


    suiteSetup(async () => {
        await activateExtension();
        //@ts-ignore
        context = testHelper.context;
        //TODO replace null with a server instance
        //@ts-ignore
        helper = new DirectCompletionTestHelper(new CompletionProvider(context,testHelper.server));
    });

    test("Should add using expression", async () => {
        let [list, doc] = await completeWithData("ShouldAddUsing.cs", 1, 5);
        await addUsing("System.Collections.Specialized", context, { name: "BitVector32", namespaces: ["System.Collections.Specialized"] });

        let addedLine = doc.lineAt(0).text;
        assert.equal(addedLine, "using System.Collections.Specialized;");
    });

    test("Provides priority to completions that were chosen before", async () => {
        extension.wipeStoredCompletions(context);
        storeCompletion(context, new Completion("ApartmentState", "System.Threading"));
        let list = await complete("ShouldPrioritize.cs", 1, 3);
        assertInFirst(5, list, "ApartmentState");
    });

    // test.only("Should show completions", async () => {
    //     let completionList = await helper.directlyComplete("ShouldShow.cs", 1, 5);
    //     assertContains(completionList, "File");
    // });



});