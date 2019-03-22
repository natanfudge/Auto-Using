import { ChildProcess, execFile } from "child_process";

const location = "C:\\Users\\natan\\Desktop\\Auto-Using-Git\\AutoUsingCs\\AutoUsing\\bin\\Debug\\netcoreapp2.1\\AutoUsing.dll";


export class AutoUsingServer {
    private process: ChildProcess;

    constructor() {
        this.process = execFile(`dotnet`, [location]);
        this.process.stdout.on('data', this.recieveMessage);
    
        
        this.process.on('close', (code) => {
            console.log(`Auto Using server exited with code ${code}`);
        });


    }

    private recieveMessage(message : string) : void{
        console.log("Recieved message: " + message);
    }
}