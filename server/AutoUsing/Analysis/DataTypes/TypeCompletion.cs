using System;
using System.Collections.Generic;
using System.Linq;

namespace AutoUsing.Analysis.DataTypes
{
    /// <summary>
    /// Represents classes of the same name 
    /// </summary>
    public class TypeCompletion
    {
        /// <summary>
        /// The name of the classes
        /// </summary>
        /// <value></value>
        public string Name { get; set; }
        /// <summary>
        /// The namespace of each class
        /// </summary>
        /// <value></value>
        public List<string> Namespaces { get; set; }

        public TypeCompletion(string name, List<string> namespaces)
        {
            this.Name = name;
            this.Namespaces = namespaces;
        }
        public TypeCompletion(){}

        public override bool Equals(object obj)
        {
            return obj is TypeCompletion typeCompletion &&
                   Name == typeCompletion.Name &&
                   Namespaces.SequenceEqual(typeCompletion.Namespaces);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Name, Namespaces);
        }
    }
}