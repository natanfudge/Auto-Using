using System;
using System.Collections.Generic;

namespace AutoUsing.Analysis.DataTypes
{
    public class ExtensionClass
    {
        public ExtensionClass(){}

        public ExtensionClass(string extendedClass, List<ExtensionMethod> extensionMethods)
        {
            this.Extends = extendedClass;
            this.Methods = extensionMethods;
        }

        public string Extends { get; set; }
        public List<ExtensionMethod> Methods { get; set; }

        public override bool Equals(object obj)
        {
            return obj is ExtensionClass @class &&
                   Extends == @class.Extends &&
                   EqualityComparer<List<ExtensionMethod>>.Default.Equals(Methods, @class.Methods);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Extends, Methods);
        }
    }
}