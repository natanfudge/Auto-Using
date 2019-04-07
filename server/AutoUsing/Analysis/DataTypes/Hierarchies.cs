using System.Linq;
using System;
using System.Collections.Generic;

namespace AutoUsing.Analysis.DataTypes
{
    /// <summary>
    /// Represents the superclasses of all classes of the same name
    /// </summary>
    public class Hierarchies
    {
        public Hierarchies() { }

        public Hierarchies(string @class, List<Hierarchy> namespaces)
        {
            this.Class = @class;
            this.Namespaces = namespaces;
        }

        /// <summary>
        /// The name of the classes
        /// </summary>
        public string Class { get; set; }
        /// <summary>
        /// The namespace of each class
        /// </summary>
        public List<Hierarchy> Namespaces { get; set; }

        public override bool Equals(object obj)
        {
            return obj is Hierarchies hiearchies &&
                   Class == hiearchies.Class &&
                   Namespaces.SequenceEqual(hiearchies.Namespaces);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Class, Namespaces);
        }
    }
}