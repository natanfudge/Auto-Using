using System.Linq;
using System;
using System.Collections.Generic;

namespace AutoUsing.Analysis.DataTypes
{
    public class ExtensionClass
    {
        public ExtensionClass(){}

        public ExtensionClass(string extendedClass, List<ExtensionMethod> extensionMethods)
        {
            this.ExtendedClass = extendedClass;
            this.ExtensionMethods = extensionMethods;
        }

        public string ExtendedClass { get; set; }
        public List<ExtensionMethod> ExtensionMethods { get; set; }

        public override bool Equals(object obj)
        {
            return obj is ExtensionClass @class &&
                   ExtendedClass == @class.ExtendedClass &&
                  ExtensionMethods.SequenceEqual(@class.ExtensionMethods);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(ExtendedClass, ExtensionMethods);
        }
    }
}