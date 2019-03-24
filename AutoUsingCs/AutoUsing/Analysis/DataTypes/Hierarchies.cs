using System;
using System.Collections.Generic;

namespace AutoUsing.Analysis.DataTypes
{
    public class Hierarchies
    {
        public Hierarchies() { }

        public Hierarchies(string @class, List<Hierarchy> namespaces)
        {
            this.Class = @class;
            this.Namespaces = namespaces;
        }

        public string Class { get; set; }
        public List<Hierarchy> Namespaces { get; set; }

        public override bool Equals(object obj)
        {
            return obj is Hierarchies hiearchies &&
                   Class == hiearchies.Class &&
                   EqualityComparer<List<Hierarchy>>.Default.Equals(Namespaces, hiearchies.Namespaces);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Class, Namespaces);
        }
    }
}