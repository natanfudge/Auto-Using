using System;

namespace AutoUsing
{

    public class ExtensionMethodInfo
    {

        
        public ExtensionMethodInfo(string extendingNamespace, string extendingMethod, string extendedClass, string extendedNamespace)
        {
            this.extendingNamespace = extendingNamespace;
            this.extendingMethod = extendingMethod;
            this.extendedClass = extendedClass;
            this.extendedNamespace = extendedNamespace;
        }

        public string extendingNamespace { get; set; }
        public string extendingMethod { get; set; }
        public string extendedClass { get; set; }
        public string extendedNamespace { get; set; }

        public override bool Equals(object obj)
        {
            var info = obj as ExtensionMethodInfo;
            return info != null &&
                   extendingNamespace == info.extendingNamespace &&
                   extendingMethod == info.extendingMethod &&
                   extendedClass == info.extendedClass &&
                   extendedNamespace == info.extendedNamespace;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(extendingNamespace, extendingMethod, extendedClass, extendedNamespace);
        }
    }
}