// //
// // Note: This example test is leveraging the Mocha test framework.
// // Please refer to their documentation on https://mochajs.org/ for help.
// //

// // The module 'assert' provides assertion methods from node

// import { activateExtension, assertInFirst, openTest, assertContains, forServerToBeReady } from './testUtil';
// import * as vscode from "vscode";
// // import { testHelper, COMPLETION_STORAGE, Completion } from '../extension';
// import * as assert from "assert";
// import { StoredCompletion, COMPLETION_STORAGE, testHelper, addUsing, storeCompletion } from '../extension';
// import * as extension from "../extension";
// import { completeWithData, complete, DirectCompletionTestHelper } from './TestCompletionUtil';
// import { CompletionProvider } from '../CompletionProviderFUCK';


// // Defines a Mocha test suite to group tests of similar kind together
// suite("CompletionProvider Type Context Tests",  ()=> {

    //TODO: restore these tests in the server side

//     let context: vscode.ExtensionContext;
//     let helper: DirectCompletionTestHelper;


//     suiteSetup(async () => {
//         await activateExtension();
//         //@ts-ignore
//         context = testHelper.context;
//         //@ts-ignore
//         helper = new DirectCompletionTestHelper(new CompletionProvider(context,testHelper.server));

//         await forServerToBeReady();
//     });

//     test("Should add using expression", async () => {
//         let [list, doc] = await completeWithData("ShouldAddUsing.cs", 1, 5);
//         await addUsing("System.Collections.Specialized", context, { name: "BitVector32", namespaces: ["System.Collections.Specialized"] });

//         let addedLine = doc.lineAt(0).text;
//         assert.equal(addedLine, "using System.Collections.Specialized;");
//     });

//     test("Provides priority to completions that were chosen before", async () => {
//         extension.wipeStoredCompletions(context);
//         storeCompletion(context, new StoredCompletion("ApartmentState", "System.Threading"));
//         let list = await complete("ShouldPrioritize.cs", 1, 4);
//         assertInFirst(5, list, "ApartmentState");
//     });





// });