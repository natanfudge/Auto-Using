using System.Collections.Generic;

namespace AutoUsing.Analysis.DataTypes
{
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
    }
}