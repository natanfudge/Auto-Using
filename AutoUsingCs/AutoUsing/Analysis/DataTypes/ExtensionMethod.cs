using System.Linq;
using System;
using System.Collections.Generic;

namespace AutoUsing.Analysis.DataTypes
{
    public class ExtensionMethod
    {
        public ExtensionMethod(){}

        public ExtensionMethod(string name, List<string> namespaces)
        {
            this.Name = name;
            this.Namespaces = namespaces;
        }

        public string Name { get; set; }
        public List<string> Namespaces { get; set; }

        public override bool Equals(object obj)
        {
            return obj is ExtensionMethod method &&
                   Name == method.Name &&
                   Namespaces.SequenceEqual( method.Namespaces);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Name, Namespaces);
        }
    }
}