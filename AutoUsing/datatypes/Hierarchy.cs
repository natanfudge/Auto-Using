using System;
using System.Collections.Generic;

namespace AutoUsing.datatypes
{
    public class ClassHiearchies
    {

        public ClassHiearchies(){}

        public ClassHiearchies(string @class, List<NamespaceHiearchy> namespaces)
        {
            this.@class = @class;
            this.namespaces = namespaces;
        }

        public string @class{get;set;}
        public List<NamespaceHiearchy> namespaces{get;set;}

        public override bool Equals(object obj)
        {
            var hiearchies = obj as ClassHiearchies;
            return hiearchies != null &&
                   @class == hiearchies.@class &&
                   EqualityComparer<List<NamespaceHiearchy>>.Default.Equals(namespaces, hiearchies.namespaces);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(@class, namespaces);
        }

        
    }

    public class NamespaceHiearchy{
        public NamespaceHiearchy(){}
            public NamespaceHiearchy(string @namespace, List<string> fathers)
            {
                this.@namespace = @namespace;
                this.fathers = fathers;
            }

            public string @namespace{get;set;}
            public List<string> fathers{get;set;}

            public override bool Equals(object obj)
            {
                var hiearchies = obj as NamespaceHiearchy;
                return hiearchies != null &&
                       @namespace == hiearchies.@namespace &&
                       EqualityComparer<List<string>>.Default.Equals(fathers, hiearchies.fathers);
            }

            public override int GetHashCode()
            {
                return HashCode.Combine(@namespace, fathers);
            }
        }

        public class HiearchyInfo{
        public HiearchyInfo(string className, string @namespace, List<string> fathers)
        {
            this.className = className;
            this.@namespace = @namespace;
            this.fathers = fathers;
        }

        public string className{get;set;}
            public string @namespace{get;set;}

            public List<string> fathers{get;set;}


        }
}