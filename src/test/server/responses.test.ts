//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node

import * as vscode from "vscode";
// import { testHelper, COMPLETION_STORAGE, Completion } from '../extension';
import * as assert from "assert";

import { AutoUsingServer } from '../../server/AutoUsingServer';
import { assertFalse, assertTrue, extensionLocation } from "../testUtil";
import { invalidRequestFormat } from "../../server/Errors";


// Defines a Mocha test suite to group tests of similar kind together
suite("Server Responses Tests", function () {


    let server: AutoUsingServer;


    const testLocation = `C:\\Users\\natan\\Desktop\\Auto-Using-Git\\AutoUsingCs\\TestProg\\TestProg.csproj`;



    suiteSetup(async () => {
        // await activateExtension();
        server = new AutoUsingServer();
    });

    test("Should accept add projects request", async () => {
        let response = await server.setupWorkspace([testLocation], "C:\\Users\\natan\\Desktop\\Auto-Using-Git\\.vscode", extensionLocation);
        // assertTrue(response.Success);
    });


    const addProject = "addProject",
        addProjects = "addProjects",
        removeProject = "removeProject",
        getAllReferences = "getAllReferences",
        ping = "ping";

    // test("Should return ")



});