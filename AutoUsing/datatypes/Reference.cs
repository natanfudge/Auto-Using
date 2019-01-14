using System.Reflection.Metadata.Ecma335;
using System.Collections.Generic;
using System;
using System.Linq;

namespace AutoUsing
{
    public class ReferencePointer
    {
        public ReferencePointer() { }

        public ReferencePointer(string name, List<string> namespaces)
        {
            this.name = name;
            this.namespaces = namespaces;
        }

        public string name { get; set; }
        public List<string> namespaces { get; set; }

        public override bool Equals(object obj)
        {
            var reference = obj as ReferencePointer;
            return reference != null &&
                   name == reference.name &&
                   EqualityComparer<List<string>>.Default.Equals(namespaces, reference.namespaces);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(name, namespaces);
        }
    }

   


}