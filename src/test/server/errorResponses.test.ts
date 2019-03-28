//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node

import * as vscode from "vscode";
// import { testHelper, COMPLETION_STORAGE, Completion } from '../extension';
import * as assert from "assert";

import { AutoUsingServer } from '../../server/AutoUsingServer';
import { assertFalse } from "../testUtil";
import { invalidRequestFormat } from "../../server/Errors";
import { Response } from "../../server/Protocol";


// Defines a Mocha test suite to group tests of similar kind together
suite("Server Error Responses Tests", () => {


    let server: AutoUsingServer;

    async function sendServer(message: string): Promise<string> {
        //@ts-ignore
        return server.sendMessage(message);
    }


    suiteSetup(async () => {
        // await activateExtension();
        server = new AutoUsingServer();
    });

    test("Should return invalid format error message", async () => {
        let response = await sendServer("Wutface");
        let obj: Response<any> = JSON.parse(response);
        assertFalse(obj.success);
        assert.equal(obj.body, invalidRequestFormat);
    });

    // test("Should return ")



});