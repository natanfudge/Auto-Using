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

        public void LoadScanResults(IEnumerable<AssemblyScan> scans)
        {
            // var newReferences = new List<PackageReference>();
            // var scans = newReferences.Select(reference => new AssemblyScan(reference.Path)).Where(scanner => !scanner.CouldNotLoad());

            Types.SetCache(ScansReferenceInfo(scans));
            Hierachies.SetCache(ScansHierarchyInfo(scans));
            Extensions.SetCache(ScansExtensionsInfo(scans));

            Save();

        }

        private List<CachedObject<ReferenceInfo>> ScansReferenceInfo(IEnumerable<AssemblyScan> scans)
        {
            return scans.Select(scan => new CachedObject<ReferenceInfo>(scan.GetAllTypes(), scan.Path)).ToList();
        }

        private List<CachedObject<HierarchyInfo>> ScansHierarchyInfo(IEnumerable<AssemblyScan> scans)
        {
            return scans.Select(scan => new CachedObject<HierarchyInfo>(scan.GetAllHierarchies(), scan.Path)).ToList();
        }
        private List<CachedObject<ExtensionMethodInfo>> ScansExtensionsInfo(IEnumerable<AssemblyScan> scans)
        {
            return scans.Select(scan => new CachedObject<ExtensionMethodInfo>(scan.GetAllExtensionMethods(), scan.Path)).ToList();
        }

        /// <summary>
        /// Adds to the cache all of the data gathered in the scans
        /// </summary>
        public void AppendScanResults(IEnumerable<AssemblyScan> scans)
        {

            Types.AddCache(ScansReferenceInfo(scans));
            Hierachies.AddCache(ScansHierarchyInfo(scans));
            Extensions.AddCache(ScansExtensionsInfo(scans));

            Save();
        }

        public void DeletePackages(IEnumerable<string> packages)
        {
            Util.Log("Removing packages : " + packages.ToIndentedJson());
            Types.RemoveCache(packages);
            Util.Log("The Type cache is now just:  " + Types.ToIndentedJson());
            Hierachies.RemoveCache(packages);
            Extensions.RemoveCache(packages);

            Save();
        }

        // private void DeletePackagesFromSpecificCache<T>(Cache<T> cache, IEnumerable<PackageReference> packages)
        // {
        //     cache.RemoveCache(packages.Select(package => package.Path));
        // }

        // public void AppendScanResults(IEnumerable<AssemblyScan> scanners)
        // {
        //     Types.AddCache(scanners.SelectMany(scanner => scanner.GetAllTypes()));
        //     Hierachies.AddCache(scanners.SelectMany(scanner => scanner.GetAllHierarchies()));
        //     Extensions.AddCache(scanners.SelectMany(scanner => scanner.GetAllExtensionMethods()));

        //     Save();
        // }




        private void Save()
        {
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
                .GroupBy(hierarchy => hierarchy.Name)
                .Select(group => new Hierarchies(group.Key,
                    group.Select(info => new Hierarchy(info.Namespace, info.Parents)).ToList()))
                .OrderBy(classHierarchies => classHierarchies.Class)
                .ToList();
        }
    }
}