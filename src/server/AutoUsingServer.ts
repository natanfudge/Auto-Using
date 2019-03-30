// import { ChildProcess, execFile, spawn, execFileSync, exec } from "child_process";
// import {
//     Request, Response,
//     getAllTypes, GetAllTypesResponse, EmptyResponse, GetCompletionDataRequest, GetAllExtensionMethodsResponse,
//     ProjectSpecificRequest, GetAllHiearchiesResponse, getAllExtensions, getAllHiearchies, SetupRequest, SetupWorkspaceRequest, setupWorkspace
// } from "./Protocol";
// import { writeFileSync } from "fs";
// import { ReadLine, createInterface } from "readline";
// import { ServerError } from "./Errors";
// import { Disposable } from "vscode";
// import { getUnixChildProcessIds } from "../util";

// const useTest = false;

// const testLocation = "C:\\Users\\natan\\Desktop\\Auto-Using-Git\\AutoUsingCs\\TestProg\\bin\\Debug\\netcoreapp2.1\\TestProg.dll";
// const serverLocation = "C:\\Users\\natan\\Desktop\\Auto-Using-Git\\AutoUsingCs\\AutoUsing\\bin\\Debug\\netcoreapp2.1\\AutoUsing.dll";
// const location = useTest ? testLocation : serverLocation;

// const logResponses = false;
// const logRequests = false;
// const maxLogSize = 1000;
// const logServerPerformance = true;

// export class AutoUsingServer {
//     private process: ChildProcess;

//     private readLine: ReadLine;

//     private projectsSetUp: boolean = false;
//     // private disposable: Disposable;

//     // private requesetQueue : RequestQueue

//     // private recieveMessage : ((message : string) => void);

//     constructor() {
//         this.process = spawn(`dotnet`, [location]);

//         this.process.stderr.on('data', this.recieveError);

//         this.readLine = createInterface({
//             input: this.process.stdout,
//             output: this.process.stdin,
//             terminal: false
//         });

//         // const lineReceived = this.onLineRecieved.bind(this);

//         // this.readLine.addListener("line", lineReceived);

//         // this.disposable = new Disposable(() => this.readLine.removeListener("line", lineReceived));

//     }

//     private runOnServerReady: (() => void) | undefined;

//     public serverReady(): Promise<void> {
//         return new Promise((resolve, reject) => {
//             this.runOnServerReady = resolve;
//         });
//     }

//     public isReady(): boolean {
//         return this.projectsSetUp;
//     }



//     // private onLineRecieved(line: string): void {
//     //     if (line[0] !== '{') {
//     //         console.log("Log from the server: " + line);
//     //         return;
//     //     }

//     //     let response : Response<any>= JSON.parse(line);
//     //     const request = this.requestQueue.dequeue(packet.Command, packet.Request_seq);
//     //     // console.log("RECIEVED: " + line);
//     // }

//     // public stop() : void{
//     //     this.
//     //     // this.process = null;

//     // }






//     public getAllTypes(projectName: string, wordToComplete: string): Promise<GetAllTypesResponse> {
//         return this.sendRequest({ command: getAllTypes, arguments: { projectName, wordToComplete } });
//     }
//     public getAllExtensionMethods(projectName: string, wordToComplete: string): Promise<GetAllExtensionMethodsResponse> {
//         return this.sendRequest({ command: getAllExtensions, arguments: { projectName, wordToComplete } });
//     }
//     public getAllHiearchies(projectName: string): Promise<GetAllHiearchiesResponse> {
//         return this.sendRequest({ command: getAllHiearchies, arguments: { projectName } });
//     }
//     public async setupWorkspace(projects: string[], vscodeDir: string, extensionDir: string): Promise<EmptyResponse> {
//         let args: SetupWorkspaceRequest = { projects, workspaceStorageDir: vscodeDir, extensionDir };
//         let response = await this.sendRequest({ command: setupWorkspace, arguments: args });
//         // Once the projects are added we can start accepting other requests
//         this.projectsSetUp = true;
//         if (this.runOnServerReady) this.runOnServerReady();
//         return response;
//     }


//     private logResponse(response: string): void {
//         if (logResponses) {
//             let length = response.length;
//             if (length > maxLogSize) response = response.slice(0, maxLogSize / 2) + " ... " + response.slice(-maxLogSize / 2);
//             console.log(`Recieved response of length ${length}:\n ${response}`);
//         }
//     }

//     private logRequest(request: string): void {
//         if (logRequests) {
//             let length = request.length;
//             if (length > maxLogSize) request = request.slice(0, maxLogSize / 2) + " ... " + request.slice(-maxLogSize / 2);
//             console.log(`Sending request of length ${length}:\n ${request}`);
//         }
//     }

//     private logResponseTime(request: string, startTime: number) {
//         if (logServerPerformance) {
//             console.log(`Request ${request} took ${(Date.now() - startTime)}  milliseconds to go back and forth.`);
//         }
//     }

//     // private async sendSetupRequest(req : Request) : Promise<any>{
//     //     let startTime = Date.now();
//     //     let response = await this.sendMessage(JSON.stringify(req));
//     //     this.logResponse(response);
//     //     let responseObject: Response<any> = JSON.parse(response);
//     //     // Check for errors
//     //     if (!responseObject.success) throw new ServerError(responseObject.body);
//     //     // Log performance
//     //     this.logResponseTime(req.command, startTime);
//     //     return responseObject.body;
//     // }

//     private async sendRequest(req: Request): Promise<any> {
//         let startTime = Date.now();
//         let response = await this.sendMessage(JSON.stringify(req));
//         this.logResponse(response);
//         let responseObject: Response<any> = JSON.parse(response);
//         // Check for errors
//         if (!responseObject.success) throw new ServerError(responseObject.body);
//         // Log performance
//         this.logResponseTime(req.command, startTime);
//         return responseObject.body;
//     }

//     private sendMessage(message: string): Promise<string> {
//         this.logRequest(message);
//         this.process.stdin.write(message + "\n");
//         return new Promise((resolve, reject) => this.readLine.once("line", (line) => {
//             // console.log("RECIEVED: " + line);
//             resolve(line);
//         }));

//         // return new Promise((resolve, reject) => resolve("{}"));
//     }

//     // return new Promise((resolve, reject) => );


//     private recieveError(error: string): void {
//         console.log("Recieved error: " + error);
//     }


//     public async stop(): Promise<void> {

//         let cleanupPromise: Promise<void>;
//         if (process.platform === 'win32') {
//             // when killing a process in windows its child
//             // processes are *not* killed but become root
//             // processes. Therefore we use TASKKILL.EXE
//             cleanupPromise = new Promise<void>((resolve, reject) => {
//                 const killer = exec(`taskkill /F /T /PID ${this.process.pid}`, (err, stdout, stderr) => {
//                     if (err) {
//                         return reject(err);
//                     }
//                 });

//                 killer.on('exit', resolve);
//                 killer.on('error', reject);
//             });
//         }
//         else {
//             // Kill Unix process and children
//             cleanupPromise = getUnixChildProcessIds(this.process.pid)
//                 .then(children => {
//                     for (let child of children) {
//                         process.kill(child, 'SIGTERM');
//                     }

//                     this.process.kill('SIGTERM');
//                 });
//         }

//         return cleanupPromise.then(() => {
//             // this.disposable.dispose();
//         });

//     }
// }
