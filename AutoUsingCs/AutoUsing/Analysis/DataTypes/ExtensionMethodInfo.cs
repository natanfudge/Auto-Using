using System;

namespace AutoUsing.Analysis.DataTypes
{
    public class ExtensionMethodInfo
    {
        public ExtensionMethodInfo(string extendingNamespace, string extendingMethod, string extendedClass)
        {
            this.Namespace = extendingNamespace;
            this.Method = extendingMethod;
            this.Class = extendedClass;
        }

        public string Namespace { get; set; }
        public string Method { get; set; }
        public string Class { get; set; }

        public override bool Equals(object obj)
        {
            return obj is ExtensionMethodInfo info &&
                   Namespace == info.Namespace &&
                   Method == info.Method &&
                   Class == info.Class;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Namespace, Method, Class);
        }
    }
}