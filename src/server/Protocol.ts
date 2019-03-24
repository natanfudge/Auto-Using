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


export interface AddProjectsRequest extends RequestArguments{
    projects: string[];
}


export interface ProjectSpecificRequest {
    projectName: string;
}

export interface GetCompletionDataRequest extends ProjectSpecificRequest {
    wordToComplete: string;
}

export const addProject = "addProject",
    addProjects = "addProjects",
    removeProject = "removeProject",
    getAllReferences = "getAllReferences",

    getAllHiearchies = "getAllHiearchies",
    getAllExtensions = "getAllExtensions",
    ping = "ping";

