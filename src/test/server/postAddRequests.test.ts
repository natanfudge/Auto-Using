//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node

import * as vscode from "vscode";
// import { testHelper, COMPLETION_STORAGE, Completion } from '../extension';
import * as assert from "assert";

import { AutoUsingServer } from '../../server/AutoUsingServer';
import { assertFalse, assertTrue, assertContains } from "../testUtil";
import { invalidRequestFormat } from "../../server/Errors";


// Defines a Mocha test suite to group tests of similar kind together
suite("Server Responses Tests For After a project has been added", () =>{


    let server: AutoUsingServer;


    const testLocation = `C:\\Users\\natan\\Desktop\\Auto-Using-Git\\AutoUsingCs\\TestProg\\TestProg.csproj`;



    suiteSetup(async () => {
        // await activateExtension();
        server = new AutoUsingServer();
        await server.addProjects([testLocation]);
    });


    test("Should get all references", async () => {
        let response = await server.getAllReferences("TestProg", "");
        assert.notEqual(response,[]);
    });

    test("Should get all references", async () => {
        let response = await server.getAllExtensionMethods("TestProg", "S");
        assert.notEqual(response,[]);
    });

    test("Should get all references", async () => {
        let response = await server.getAllHiearchies("TestProg");
        assert.notEqual(response,[]);
    });

    test("Should get all references filtered by word to complete", async () => {
        let response = await server.getAllReferences("TestProg", "J");
        assert.notEqual(response,[]);
    });

    const addProject = "addProject",
        addProjects = "addProjects",
        removeProject = "removeProject",
        getAllReferences = "getAllReferences",
        ping = "ping";

    // test("Should return ")



});