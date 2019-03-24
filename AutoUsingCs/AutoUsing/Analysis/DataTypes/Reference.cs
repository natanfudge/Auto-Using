using System;
using System.Collections.Generic;
using System.Linq;

namespace AutoUsing.Analysis.DataTypes
{
    public class Reference
    {
        public string Name { get; set; }
        public List<string> Namespaces { get; set; }

        public Reference(string name, List<string> namespaces)
        {
            this.Name = name;
            this.Namespaces = namespaces;
        }

        public override bool Equals(object obj)
        {
            return obj is Reference reference &&
                   Name == reference.Name &&
                   Namespaces.SequenceEqual(reference.Namespaces);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Name, Namespaces);
        }
    }
}