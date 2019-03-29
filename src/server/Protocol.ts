export interface Response<T> {
    success: boolean;
    body: T;
}

export type GetAllTypesResponse = Array<Completion>;
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
    extensionDir: string;

}

export interface SetupRequest extends RequestArguments {
    globalStoragePath: string;
}


export interface ProjectSpecificRequest {
    projectName: string;
}

export interface GetCompletionDataRequest extends ProjectSpecificRequest {
    wordToComplete: string;
}


export interface ClassHiearchies {
    class: string;
    namespaces: Array<NamespaceHiearchy>;
}

export interface NamespaceHiearchy {
    namespace: string;
    parents: Array<string>;
}

export interface Completion {
    name: string;
    namespaces: string[];
}

export interface ExtendedClass {
    extendedClass: string;
    extensionMethods: Completion[];
}



export const
    setupWorkspace = "setupWorkspace",
    getAllTypes = "getAllTypes",

    getAllHiearchies = "getAllHiearchies",
    getAllExtensions = "getAllExtensions",
    ping = "ping";

