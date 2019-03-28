using System.Linq;
using System;
using System.Collections.Generic;

namespace AutoUsing.Analysis.DataTypes
{
    /// <summary>
    /// An extension method that is extending a class
    /// Example: static class Foo {
    ///    static void Bar(this Baz param){...}
    /// }
    /// In this case Bar is the ExtensionMethod
    /// </summary>
    public class ExtensionMethod
    {
        public ExtensionMethod() { }

        public ExtensionMethod(string name, List<string> namespaces)
        {
            this.Name = name;
            this.Namespaces = namespaces;
        }

        /// <summary>
        /// The name of the extension method 
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// The list of namespaces that have extension methods with this name
        /// </summary>
        public List<string> Namespaces { get; set; }

        public override bool Equals(object obj)
        {
            return obj is ExtensionMethod method &&
                   Name == method.Name &&
                   Namespaces.SequenceEqual(method.Namespaces);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Name, Namespaces);
        }
    }
}