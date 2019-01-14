// import { classHierachies } from "./csdata/csHierachies";

// import { binarySearchGen } from "./speedutil";

// import { extensionMethods } from "./csdata/csExtensionMethods";
// import * as vscode from "vscode";

// export function provideExtensionCompletions(extendedClass: string): vscode.CompletionItem[] {

//     let extensibleClasses = classHierachies[binarySearchGen(classHierachies, extendedClass, ((h1, h2) => h1.localeCompare(h2.class)))];
//     if (extensibleClasses.namespaces.length === 1) {
//         let fathers = extensibleClasses.namespaces[0].fathers;
//         let extensions = fathers.map(father =>
//             extensionMethods[binarySearchGen(extensionMethods, father, (str, ext) => str.localeCompare(ext.extendedClass))])
//             .filter(obj => typeof obj !== "undefined");


//         let x = 2;
//     } else {
//         throw new Error("Auto Using does not support ambigous references yet.");
//     }

//     return [];
// }

// export function extensionMethodsToCompletions(extensionMethods : ExtendedClass[])

// let completionAmount = filterOutAlreadyUsing(references, usings);

//     let commonNames = getStoredCompletions(this.context).map(completion => completion.label);
//     commonNames.sort();
