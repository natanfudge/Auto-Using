export interface Response<T> {
    success: boolean;
    body: T;
}

export type GetAllReferencesResponse = Array<Reference>;
export type EmptyResponse = null;

// interface ResponseBody{}

// export interface  extends ResponseBody{

// }

export interface RequestArguments {

}

export interface Request {
    command: string;
    arguments: RequestArguments;
}

// declare interface RequestBody {

// }

export interface AddProjectsRequest extends RequestArguments{
    projects: string[];
}

export interface GetAllReferencesRequest extends RequestArguments{
    projectName: string;
    wordToComplete: string;
}

export const addProject = "addProject",
    addProjects = "addProjects",
    removeProject = "removeProject",
    getAllReferences = "getAllReferences",
    ping = "ping";