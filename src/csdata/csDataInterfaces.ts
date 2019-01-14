declare interface ClassHiearchies {
    class: string;
    namespaces: Array<NamespaceHiearchy>;
}

declare interface NamespaceHiearchy {
    namespace: string;
    fathers: Array<string>;
}



declare interface ExtendedClass {
    extendedClass: string;
    extendedNamespaces: ExtendedNamespace[];
}

declare interface ExtendedNamespace {
    extendedNamespace: string;
    extensionMethods: ExtensionMethod[];
}

declare interface ExtensionMethod {
    extendingMethod: string;
    extendingNamespace: string;
}
