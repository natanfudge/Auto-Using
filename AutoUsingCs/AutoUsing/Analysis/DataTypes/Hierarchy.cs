using System.Linq;
using System;
using System.Collections.Generic;

namespace AutoUsing.Analysis.DataTypes
{
    public class Hierarchy
    {
        public Hierarchy() { }

        public Hierarchy(string @namespace, List<string> fathers)
        {
            this.Namespace = @namespace;
            this.Parents = fathers;
        }

        public string Namespace { get; set; }
        public List<string> Parents { get; set; }

        public override bool Equals(object obj)
        {
            var hiearchies = obj as Hierarchy;
            return hiearchies != null &&
                   Namespace == hiearchies.Namespace &&
                   Parents.SequenceEqual(hiearchies.Parents);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Namespace, Parents);
        }
    }
}