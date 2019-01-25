using System;
using System.Collections.Generic;
using System.Linq;
using AutoUsing.Analysis.DataTypes;

namespace AutoUsing.Analysis.Cache
{
    public class CompletionCaches
    {
        public Cache<ReferenceInfo> Types { get; set; }
        public Cache<ExtensionMethodInfo> Extensions { get; set; }
        public Cache<HierarchyInfo> Hierachies { get; set; }

        public void LoadScanResults(IEnumerable<AssemblyScanner> scanners)
        {
            Types.Set(scanners.SelectMany(scanner => scanner.GetAllTypes()).ToList());
            //TODO: extensions,hierachies
            
            
            Types.Save();
            //TODO save extensions,hierachies
//            Types.Set();
        }
        
        
        /// <summary>
        /// Converts a list of raw reference info into data that is more easily interpreted as a completion
        /// </summary>
        /// <param name="referenceInfos"></param>
        /// <returns></returns>
        public static List<Reference> ToCompletionFormat(List<ReferenceInfo> referenceInfos)
        {
            
            return referenceInfos
                .Distinct()
                .GroupBy(info => info.Name)
                .Select(group => new Reference(group.Key, group.Select(info => info.Namespace).ToList()))
                .ToList();
        }


        //TODO (these are commented out in AssemblyScanner.cs)
        public static List<ExtensionMethod> ToCompletionFormat(List<ExtensionMethodInfo> extensionMethodInfos)
        {
            return null;
        }
        
        //TODO
        public static List<Hierarchies> ToCompletionFormat(List<HierarchyInfo> extensionMethodInfos)
        {
            return null;
        }
    }
}