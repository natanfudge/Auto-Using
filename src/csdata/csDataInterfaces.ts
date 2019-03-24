
declare interface ClassHiearchies {
    class: string;
    namespaces: Array<NamespaceHiearchy>;
}

declare interface NamespaceHiearchy {
    namespace: string;
    parents: Array<string>;
}

declare class Reference {
    public name: string;
     public namespaces: string[];
}

declare interface ExtendedClass {
    extendedClass: string;
    extensionMethods: Reference[];
}

