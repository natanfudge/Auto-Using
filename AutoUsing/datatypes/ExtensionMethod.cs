using System;
using System.Collections.Generic;

namespace AutoUsing
{
    public class ExtendedClass
    {


        public ExtendedClass() { }
        public ExtendedClass(string extendedClass, List<ExtendedNamespace> extendedNamespaces)
        {
            this.extendedClass = extendedClass;
            this.extendedNamespaces = extendedNamespaces;
        }

        public string extendedClass { get; set; }
        public List<ExtendedNamespace> extendedNamespaces { get; set; }

        public override bool Equals(object obj)
        {
            var @class = obj as ExtendedClass;
            return @class != null &&
                   extendedClass == @class.extendedClass &&
                   EqualityComparer<List<ExtendedNamespace>>.Default.Equals(extendedNamespaces, @class.extendedNamespaces);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(extendedClass, extendedNamespaces);
        }
    }


    public class ExtendedNamespace
    {

        public ExtendedNamespace() { }

        public ExtendedNamespace(string extendedNamespace, List<ExtensionMethod> extensionMethods)
        {
            this.extendedNamespace = extendedNamespace;
            this.extensionMethods = extensionMethods;
        }

        public string extendedNamespace { get; set; }
        public List<ExtensionMethod> extensionMethods { get; set; }

        public override bool Equals(object obj)
        {
            var namespaces = obj as ExtendedNamespace;
            return namespaces != null &&
                   extendedNamespace == namespaces.extendedNamespace &&
                   EqualityComparer<List<ExtensionMethod>>.Default.Equals(extensionMethods, namespaces.extensionMethods);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(extendedNamespace, extensionMethods);
        }
    }
    public class ExtensionMethod
    {
        public ExtensionMethod(string extendingMethod, string extendingNamespace)
        {
            this.extendingMethod = extendingMethod;
            this.extendingNamespace = extendingNamespace;
        }

        public string extendingMethod { get; set; }
        public string extendingNamespace { get; set; }

        public override bool Equals(object obj)
        {
            var method = obj as ExtensionMethod;
            return method != null &&
                   extendingMethod == method.extendingMethod &&
                   extendingNamespace == method.extendingNamespace;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(extendingMethod, extendingNamespace);
        }
    }
}