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
        public Cache<TypeCompletionInfo> Types { get; set; }
        public Cache<ExtensionMethodInfo> Extensions { get; set; }
        public Cache<HierarchyInfo> Hierachies { get; set; }

        /// <summary>
        /// Replaces the caches with the data gathered in assembly scans
        /// </summary>
        public void LoadScanResults(IEnumerable<AssemblyScan> scans)
        {
            Types.SetCache(GetReferenceInfoOfScans(scans));
            Hierachies.SetCache(GetHierarchyInfoOfScans(scans));
            Extensions.SetCache(GetExtensionsInfoOfScans(scans));

            Save();

        }


        /// <summary>
        /// Adds to the cache all of the data gathered in assembly scans
        /// </summary>
        public void AppendScanResults(IEnumerable<AssemblyScan> scans)
        {
            if (scans.Count() == 0) return;
            Types.AddCache(GetReferenceInfoOfScans(scans));
            Hierachies.AddCache(GetHierarchyInfoOfScans(scans));
            Extensions.AddCache(GetExtensionsInfoOfScans(scans));

            Save();
        }

        private List<CachedObject<TypeCompletionInfo>> GetReferenceInfoOfScans(IEnumerable<AssemblyScan> scans)
        {
            return scans.Select(scan => new CachedObject<TypeCompletionInfo>(scan.GetTypeInfo(), scan.Path)).ToList();
        }

        private List<CachedObject<HierarchyInfo>> GetHierarchyInfoOfScans(IEnumerable<AssemblyScan> scans)
        {
            return scans.Select(scan => new CachedObject<HierarchyInfo>(scan.GetHierarchyInfo(), scan.Path)).ToList();
        }
        private List<CachedObject<ExtensionMethodInfo>> GetExtensionsInfoOfScans(IEnumerable<AssemblyScan> scans)
        {
            return scans.Select(scan => new CachedObject<ExtensionMethodInfo>(scan.GetExtensionMethodInfo(), scan.Path)).ToList();
        }


        /// <summary>
        /// Removes from the caches the data of the specified packages.
        /// </summary>
        /// <param name="packageIdentifiers">The string that were used to identify the packages</param>
        public void DeletePackages(IEnumerable<string> packageIdentifiers)
        {
            if (packageIdentifiers.Count() == 0) return;
            Util.Log("Removing packages : " + packageIdentifiers.ToIndentedJson());
            Types.RemoveCache(packageIdentifiers);
            Hierachies.RemoveCache(packageIdentifiers);
            Extensions.RemoveCache(packageIdentifiers);

            Save();
        }

        private void Save()
        {
            Types.Save();
            Hierachies.Save();
            Extensions.Save();
        }


        /// <summary>
        /// Converts a list of raw reference info into data that is more easily interpreted as a completion
        /// </summary>
        public static List<TypeCompletion> ToCompletionFormat(List<TypeCompletionInfo> referenceInfos)
        {
            return referenceInfos
                .Distinct()
                .GroupBy(info => info.Name)
                .Select(group => new TypeCompletion(group.Key, group.Select(info => info.Namespace).ToList()))
                .ToList();
        }

        /// <summary>
        /// Converts a list of raw extension method info into data that is more easily interpreted as a completion
        /// </summary>
        public static List<ExtensionClass> ToCompletionFormat(List<ExtensionMethodInfo> extensionMethodInfos)
        {
            var grouped = extensionMethodInfos
                .GroupBy(TheNameOfTheExtendedClass)
                .Select(extensionMethods => extensionMethods.GroupBy(extensionMethod => extensionMethod.Method));

            return grouped
                .Select(extendedClass => new ExtensionClass(extendedClass.First().First().Class,
                    extendedClass.Select(extensionMethod => new ExtensionMethod(extensionMethod.First().Method,
                        extensionMethod.Select(info => info.Namespace).Distinct().ToList())).Distinct().ToList()))
                .ToList()
                .OrderBy(extendedClass => extendedClass.ExtendedClass)
                .ToList();
        }

        private static string TheNameOfTheExtendedClass(ExtensionMethodInfo info) => (info.Class).NoTilde();

        /// <summary>
        /// Converts a list of raw class hierarchy info into data that is more easily interpreted as a completion
        /// </summary>
        public static List<Hierarchies> ToCompletionFormat(List<HierarchyInfo> extensionMethodInfos)
        {
            return extensionMethodInfos
                .GroupBy(hierarchy => hierarchy.Name)
                .Select(group => new Hierarchies(group.Key,
                    group.Select(info => new Hierarchy(info.Namespace, info.Parents)).ToList()))
                .OrderBy(classHierarchies => classHierarchies.Class)
                .ToList();
        }
    }
}