import { _CSHARP_CLASS_HIEARCHIES } from "./csdata/csHierachies";
import { _CSHARP_REFERENCES } from "./csdata/csReferences";
import { _CSHARP_EXTENSION_METHODS } from "./csdata/csExtensionMethods";

export class DataProvider {
    private hierachies: ClassHiearchies[];
    private references: Reference[];
    private extensionMethods: ExtendedClass[];

    public constructor() {
        this.hierachies = this.cloneHiearchies(_CSHARP_CLASS_HIEARCHIES);
        this.references = this.cloneReferences(_CSHARP_REFERENCES);
        this.extensionMethods = this.cloneExtensionMethods(_CSHARP_EXTENSION_METHODS);
    }

    public getHierachies = () => this.hierachies;
    public getReferences = () => this.references;
    public getExtensionMethods = () => this.extensionMethods;

    private cloneHiearchies(hierachiesToClone: ClassHiearchies[]): ClassHiearchies[] {
        let len = hierachiesToClone.length;
        let hierachies = new Array<ClassHiearchies>(len);

        for (let i = 0; i < len; i++) {
            let hierachy = hierachiesToClone[i];
            let namespaceLen = hierachy.namespaces.length;
            let namespaces = new Array<NamespaceHiearchy>(namespaceLen);
            for (let j = 0; j < namespaceLen; j++) {
                let namespace = hierachy.namespaces[j];
                namespaces[j] = { namespace: namespace.namespace, parents: namespace.parents.slice(0) };
            }


            hierachies[i] = { class: hierachy.class, namespaces: namespaces };
        }

        return hierachies;
    }

    private cloneReferences(referencesToClone: Reference[]): Reference[] {
        let len = referencesToClone.length;
        let references = new Array<Reference>(len);
        for (let i = 0; i < len; i++) {
            let reference = referencesToClone[i];
            references[i] = { name: reference.name, namespaces: reference.namespaces.slice(0) };
        }

        return references;
    }

    private cloneExtensionMethods(extendedClassesToClone: ExtendedClass[]): ExtendedClass[] {
        let len = extendedClassesToClone.length;
        let extensions = new Array<ExtendedClass>(len);
        for (let i = 0; i < len; i++) {
            let extension = extendedClassesToClone[i];
            extensions[i] = { extendedClass: extension.extendedClass, extensionMethods: this.cloneReferences(extension.extensionMethods) };
        }

        return extensions;
    }

}