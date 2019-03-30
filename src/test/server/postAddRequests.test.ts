// //
// // Note: This example test is leveraging the Mocha test framework.
// // Please refer to their documentation on https://mochajs.org/ for help.
// //

// // The module 'assert' provides assertion methods from node

// import * as vscode from "vscode";
// // import { testHelper, COMPLETION_STORAGE, Completion } from '../extension';
// import * as assert from "assert";

// import { AutoUsingServer } from '../../server/AutoUsingServer';
// import { assertFalse, assertTrue, assertContains, extensionLocation } from "../testUtil";
// import { invalidRequestFormat } from "../../server/Errors";


// // Defines a Mocha test suite to group tests of similar kind together
// suite("Server Responses Tests For After a project has been added", () =>{


//     let server: AutoUsingServer;


//     const testLocation = `C:\\Users\\natan\\Desktop\\Auto-Using-Git\\AutoUsingCs\\TestProg\\TestProg.csproj`;



//     suiteSetup(async () => {
//         // await activateExtension();
//         server = new AutoUsingServer();
//         await server.setupWorkspace([testLocation],
//             "C:\\Users\\natan\\AppData\\Roaming\\Code\\User\\workspaceStorage\\15b109ca16b14796e52e6c96faa130db",extensionLocation);
//     });


//     test("Should get all types", async () => {
//         let response = await server.getAllTypes("TestProg", "");
//         assert.notEqual(response,[]);
//     });

//     test("Should get all Extension methods", async () => {
//         let response = await server.getAllExtensionMethods("TestProg", "S");
//         assert.notEqual(response,[]);
//     });

//     test("Should get all hierarchies", async () => {
//         let response = await server.getAllHiearchies("TestProg");
//         assert.notEqual(response,[]);
//     });

//     test("Should get all types filtered by word to complete", async () => {
//         let response = await server.getAllTypes("TestProg", "J");
//         assert.notEqual(response,[]);
//     });




// });