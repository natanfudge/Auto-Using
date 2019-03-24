import { ChildProcess, execFile, spawn, execFileSync, exec } from "child_process";
import {
    addProjects, AddProjectsRequest, Request, Response,
    getAllReferences, GetAllReferencesResponse, EmptyResponse, GetCompletionDataRequest, GetAllExtensionMethodsResponse, ProjectSpecificRequest, GetAllHiearchiesResponse, getAllExtensions, getAllHiearchies
} from "./Protocol";
import { writeFileSync } from "fs";
import { ReadLine, createInterface } from "readline";
import { ServerError } from "./Errors";

const useTest = false;

const testLocation = "C:\\Users\\natan\\Desktop\\Auto-Using-Git\\AutoUsingCs\\TestProg\\bin\\Debug\\netcoreapp2.1\\TestProg.dll";
const serverLocation = "C:\\Users\\natan\\Desktop\\Auto-Using-Git\\AutoUsingCs\\AutoUsing\\bin\\Debug\\netcoreapp2.1\\AutoUsing.dll";
const location = useTest ? testLocation : serverLocation;

const logResponses = false;
const logRequests = false;
const maxLogSize = 1000;
const logServerPerformance = true;

export class AutoUsingServer {
    private process: ChildProcess;

    private readLine: ReadLine;

    // private recieveMessage : ((message : string) => void);

    constructor() {
        this.process = spawn(`dotnet`, [location]);

        this.process.stderr.on('data', this.recieveError);

        this.readLine = createInterface({
            input: this.process.stdout,
            output: this.process.stdin,
            terminal: false
        });

    }

    // public stop() : void{
    //     this.
    //     // this.process = null;

    // }






    public getAllReferences(projectName: string, wordToComplete: string): Promise<GetAllReferencesResponse> {
        return this.sendRequest({ command: getAllReferences, arguments: { projectName, wordToComplete } });
    }
    public getAllExtensionMethods(projectName: string, wordToComplete: string): Promise<GetAllExtensionMethodsResponse> {
        return this.sendRequest({ command: getAllExtensions, arguments: { projectName, wordToComplete } });
    }
    public getAllHiearchies(projectName: string): Promise<GetAllHiearchiesResponse> {
        return this.sendRequest({ command: getAllHiearchies, arguments: { projectName } });
    }
    public addProjects(projects: string[]): Promise<EmptyResponse> {
        let args: AddProjectsRequest = { projects };
        return this.sendRequest({ command: addProjects, arguments: args });
    }


    private logResponse(response: string): void {
        if (logResponses) {
            let length = response.length;
            if (length > maxLogSize) response = response.slice(0, maxLogSize / 2) + " ... " + response.slice(-maxLogSize / 2);
            console.log(`Recieved response of length ${length}:\n ${response}`);
        }
    }

    private logRequest(request: string): void {
        if (logRequests) {
            let length = request.length;
            if (length > maxLogSize) request = request.slice(0, maxLogSize / 2) + " ... " + request.slice(-maxLogSize / 2);
            console.log(`Sending request of length ${length}:\n ${request}`);
        }
    }

    private logResponseTime(request: string, startTime: number) {
        if (logServerPerformance) {
            console.log(`Request ${request} took ${(Date.now() - startTime)}  milliseconds to go back and forth.`);
        }
    }

    private async sendRequest(req: Request): Promise<any> {
        let startTime = Date.now();
        let response = await this.sendMessage(JSON.stringify(req));
        this.logResponse(response);
        let responseObject: Response<any> = JSON.parse(response);
        // Check for errors
        if (!responseObject.success) throw new ServerError(responseObject.body);
        // Log performance
        this.logResponseTime(req.command, startTime);
        return responseObject.body;
    }

    private sendMessage(message: string): Promise<string> {
        this.logRequest(message);
        this.process.stdin.write(message + "\n");
        return new Promise((resolve, reject) => this.readLine.once("line", resolve));
    }

    // return new Promise((resolve, reject) => );


    private recieveError(error: string): void {
        console.log("Recieved error: " + error);
    }
}