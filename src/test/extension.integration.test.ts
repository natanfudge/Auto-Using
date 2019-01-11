//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node

import { activateExtension, assertInFirst } from './testUtil';
import * as vscode from "vscode";
// import { testHelper, COMPLETION_STORAGE, Completion } from '../extension';
import { Reference } from '../CompletionProvider';
import * as assert from "assert";
import { Completion, COMPLETION_STORAGE, testHelper, addUsing, storeCompletion } from '../extension';
import * as extension from "../extension";
import { complete, completeWithData } from './extension.e2e.test';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../extension';

// Defines a Mocha test suite to group tests of similar kind together
suite("CompletionProvider Integration Tests", function () {


    let context: vscode.ExtensionContext;


    suiteSetup(async () => {
        await activateExtension();
        //@ts-ignore
        context = testHelper.context;
    });

    test("Add Using expression", async () => {
        let [list, doc] = await completeWithData("ShouldAddUsing.cs", 1, 5);
        await addUsing("System.Collections.Specialized", context, new Reference("BitVector32", ["System.Collections.Specialized"]));

        let addedLine = doc.lineAt(0).text;
        assert.equal(addedLine, "using System.Collections.Specialized;");
    });

    test("Provides priority to completions that were chosen before", async () => {
        extension.wipeStoredCompletions(context);
        storeCompletion(context, new Completion("ApartmentState", "System.Threading"));
        let list = await complete("ShouldPrioritize.cs", 1, 3);
        assertInFirst(5, list, "ApartmentState");
    });



});