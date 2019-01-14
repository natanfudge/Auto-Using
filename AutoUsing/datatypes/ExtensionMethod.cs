using System;
using System.Collections.Generic;

namespace AutoUsing
{
    public class ExtendedClass
    {

        public ExtendedClass(){}

        public ExtendedClass(string extendedClass, List<ExtensionMethod> extensionMethods)
        {
            this.extendedClass = extendedClass;
            this.extensionMethods = extensionMethods;
        }

        public string extendedClass { get; set; }
        public List<ExtensionMethod> extensionMethods { get; set; }

        public override bool Equals(object obj)
        {
            var @class = obj as ExtendedClass;
            return @class != null &&
                   extendedClass == @class.extendedClass &&
                   EqualityComparer<List<ExtensionMethod>>.Default.Equals(extensionMethods, @class.extensionMethods);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(extendedClass, extensionMethods);
        }
    }


    public class ExtensionMethod
    {

        public ExtensionMethod(){}
        public ExtensionMethod(string name, List<string> namespaces)
        {
            this.name = name;
            this.namespaces = namespaces;
        }

        public string name { get; set; }
        public List<string> namespaces { get; set; }

        public override bool Equals(object obj)
        {
            var method = obj as ExtensionMethod;
            return method != null &&
                   name == method.name &&
                   EqualityComparer<List<string>>.Default.Equals(namespaces, method.namespaces);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(name, namespaces);
        }
    }
    // public class ExtensionMethod
    // {
    //     public ExtensionMethod(string extendingMethod, string extendingNamespace)
    //     {
    //         this.extendingMethod = extendingMethod;
    //         this.extendingNamespace = extendingNamespace;
    //     }

    //     public string extendingMethod { get; set; }
    //     public string extendingNamespace { get; set; }

    //     public override bool Equals(object obj)
    //     {
    //         var method = obj as ExtensionMethod;
    //         return method != null &&
    //                extendingMethod == method.extendingMethod &&
    //                extendingNamespace == method.extendingNamespace;
    //     }

    //     public override int GetHashCode()
    //     {
    //         return HashCode.Combine(extendingMethod, extendingNamespace);
    //     }
    // }
}