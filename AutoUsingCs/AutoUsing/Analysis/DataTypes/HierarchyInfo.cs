using System.Linq;
using System;
using System.Collections.Generic;

namespace AutoUsing.Analysis.DataTypes
{
     /// <summary>
    /// Information about the superclasses of a class that is stored and then later used to produce extension method completinos
    /// </summary>
    public class HierarchyInfo
    {
        public HierarchyInfo(string className, string @namespace, List<string> fathers)
        {
            this.Name = className;
            this.Namespace = @namespace;
            this.Parents = fathers;
        }

        public string Name { get; set; }
        public string Namespace { get; set; }

        public List<string> Parents { get; set; }

        public override bool Equals(object obj)
        {
            var info = obj as HierarchyInfo;
            return info != null &&
                   Name == info.Name &&
                   Namespace == info.Namespace &&
                  Parents.SequenceEqual( info.Parents);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Name, Namespace, Parents);
        }
    }
}