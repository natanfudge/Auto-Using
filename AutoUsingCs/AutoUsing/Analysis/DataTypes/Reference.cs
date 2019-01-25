using System;
using System.Collections.Generic;
using System.Linq;

namespace AutoUsing.Analysis.DataTypes
{
    public class Reference
    {
        public string Name { get; set; }
        public List<string> Namespace { get; set; }

        public Reference(string name, List<string> namespaces)
        {
            this.Name = name;
            this.Namespace = namespaces;
        }

        public override bool Equals(object obj)
        {
            return obj is Reference reference &&
                   Name == reference.Name &&
                   Namespace.SequenceEqual(reference.Namespace);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Name, Namespace);
        }
    }
}