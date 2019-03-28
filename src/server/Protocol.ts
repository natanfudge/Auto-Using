export interface Response<T> {
    success: boolean;
    body: T;
}

export type GetAllReferencesResponse = Array<Reference>;
export type GetAllExtensionMethodsResponse = Array<ExtendedClass>;
export type GetAllHiearchiesResponse = Array<ClassHiearchies>;
export type EmptyResponse = null;

export interface RequestArguments {

}

export interface Request {
    command: string;
    arguments: RequestArguments;
}


export interface SetupWorkspaceRequest extends RequestArguments {
    projects: string[];
    workspaceStorageDir: string;
    extensionDir : string;

}

export interface SetupRequest extends RequestArguments{
    globalStoragePath : string;
}


export interface ProjectSpecificRequest {
    projectName: string;
}

export interface GetCompletionDataRequest extends ProjectSpecificRequest {
    wordToComplete: string;
}

export const 
    setupWorkspace = "setupWorkspace",
    getAllReferences = "getAllReferences",

    getAllHiearchies = "getAllHiearchies",
    getAllExtensions = "getAllExtensions",
    ping = "ping";

