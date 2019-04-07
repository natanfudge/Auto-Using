using System.Linq;
using System;
using System.Collections.Generic;

namespace AutoUsing.Analysis.DataTypes
{
    /// <summary>
    /// A class that is being extended by an extension method
    /// Example: static class Foo {
    ///    static void Bar(this Baz param){...}
    /// }
    /// In this case Baz is the ExtensionClass
    /// </summary>
    public class ExtensionClass
    {
        public ExtensionClass(){}

        public ExtensionClass(string extendedClass, List<ExtensionMethod> extensionMethods)
        {
            this.ExtendedClass = extendedClass;
            this.ExtensionMethods = extensionMethods;
        }

        /// <summary>
        /// The name of the extended class
        /// </summary>
        public string ExtendedClass { get; set; }
        /// <summary>
        /// The list of extension methods that extend this class
        /// </summary>
        public List<ExtensionMethod> ExtensionMethods { get; set; }

        public override bool Equals(object obj)
        {
            return obj is ExtensionClass @class &&
                   ExtendedClass == @class.ExtendedClass &&
                  ExtensionMethods.SequenceEqual(@class.ExtensionMethods);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(ExtendedClass, ExtensionMethods);
        }
    }
}