using System;
using System.Collections.Generic;
using System.Linq;
using AutoUsing.Analysis.DataTypes;

namespace AutoUsing.Analysis.Cache
{
    /// <summary>
    /// Caches for all the data that is required in the auto-using extension 
    /// </summary>
    public class CompletionCaches
    {
        public Cache<ReferenceInfo> Types { get; set; }
        public Cache<ExtensionMethodInfo> Extensions { get; set; }
        public Cache<HierarchyInfo> Hierachies { get; set; }

        public void LoadScanResults(IEnumerable<AssemblyScan> scanners)
        {
            Types.SetCache(scanners.SelectMany(scanner => scanner.GetAllTypes()).ToList());
            Hierachies.SetCache(scanners.SelectMany(scanner => scanner.GetAllHierarchies()).ToList());
            Extensions.SetCache(scanners.SelectMany(scanner => scanner.GetAllExtensionMethods()).ToList());


            Types.Save();
            Hierachies.Save();
            Extensions.Save();
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


        public static List<ExtensionClass> ToCompletionFormat(List<ExtensionMethodInfo> extensionMethodInfos)
        {
            var grouped = extensionMethodInfos
                .GroupBy(ExtendedClassName)
                .Select(extensionMethods => extensionMethods.GroupBy(extensionMethod => extensionMethod.Method));

            return grouped
                .Select(extendedClass => new ExtensionClass(extendedClass.First().First().Class,
                    extendedClass.Select(extensionMethod => new ExtensionMethod(extensionMethod.First().Method,
                        extensionMethod.Select(info => info.Namespace).Distinct().ToList())).Distinct().ToList()))
                .ToList()
                .OrderBy(extendedClass => extendedClass.ExtendedClass)
                .ToList();
        }

        private static string ExtendedClassName(ExtensionMethodInfo info) => (info.Class).NoTilde();

        public static List<Hierarchies> ToCompletionFormat(List<HierarchyInfo> extensionMethodInfos)
        {
            return extensionMethodInfos
                 .GroupBy(hierachy => hierachy.Name)
                 .Select(group => new Hierarchies(group.Key,
                     group.Select(info => new Hierarchy(info.Namespace, info.Parents)).ToList()))
                 .OrderBy(classHierachies => classHierachies.Class)
                 .ToList();
        }
    }
}