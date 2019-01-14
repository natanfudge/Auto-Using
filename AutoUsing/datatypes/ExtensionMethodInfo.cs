using System;

namespace AutoUsing
{

    public class ExtensionMethodInfo
    {

        
        public ExtensionMethodInfo(string extendingNamespace, string extendingMethod, string extendedClass)
        {
            this.extendingNamespace = extendingNamespace;
            this.extendingMethod = extendingMethod;
            this.extendedClass = extendedClass;
        }

        public string extendingNamespace { get; set; }
        public string extendingMethod { get; set; }
        public string extendedClass { get; set; }

        public override bool Equals(object obj)
        {
            var info = obj as ExtensionMethodInfo;
            return info != null &&
                   extendingNamespace == info.extendingNamespace &&
                   extendingMethod == info.extendingMethod &&
                   extendedClass == info.extendedClass;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(extendingNamespace, extendingMethod, extendedClass);
        }
    }
}