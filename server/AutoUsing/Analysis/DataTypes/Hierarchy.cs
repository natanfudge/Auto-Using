using System.Linq;
using System;
using System.Collections.Generic;

namespace AutoUsing.Analysis.DataTypes
{
    /// <summary>
    /// Represents the superclasses of a specific class all the way up to Object
    /// </summary>
    public class Hierarchy
    {
        public Hierarchy() { }

        public Hierarchy(string @namespace, List<string> parents)
        {
            this.Namespace = @namespace;
            this.Parents = parents;
        }

        /// <summary>
        /// The namespace of the class
        /// </summary>
        public string Namespace { get; set; }
        /// <summary>
        /// The superclasses of the class (including superclasses of superclasses)
        /// </summary>
        /// <value></value>
        public List<string> Parents { get; set; }

        public override bool Equals(object obj)
        {
            // var hiearchies = obj as Hierarchy;
            return obj is Hierarchy hiearchies &&
                   Namespace == hiearchies.Namespace &&
                   Parents.SequenceEqual(hiearchies.Parents);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Namespace, Parents);
        }
    }
}