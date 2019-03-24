using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using AutoUsing.Analysis.DataTypes;

namespace AutoUsing.Analysis.Cache
{
    /// <summary>
    /// Completion cache of all of the base c# libraries
    /// </summary>
    public static class GlobalCache
    {
        public static CompletionCaches Caches = new CompletionCaches
        {
            Types =
                new Cache<ReferenceInfo>("C:/Users/natan/Desktop/Auto-Using-Git/out/cache/references.json"),
            Extensions = new Cache<ExtensionMethodInfo>("C:/Users/natan/Desktop/Auto-Using-Git/out/cache/extensions.json"),
            Hierachies = new Cache<HierarchyInfo>("C:/Users/natan/Desktop/Auto-Using-Git/out/cache/hierachies.json")

        };

        static GlobalCache()
        {
            var scanners = GetBaseAssemblyScans();

            if (Caches.Types.IsEmpty() || Caches.Hierachies.IsEmpty() || Caches.Extensions.IsEmpty())
            {
                Caches.LoadScanResults(scanners);
            }


        }


        /// <summary>
        /// Gets location of the .NET base assemblies
        /// </summary>
        private static string[] GetBinFiles()
        {
            var dotnetDir = Directory.GetParent(typeof(int).Assembly.Location);
            var files = Directory.GetFiles(dotnetDir.FullName, "*.dll");
            return files;
        }


        private static IEnumerable<AssemblyScan> GetBaseAssemblyScans()
        {
            var bins = GetBinFiles();
            return bins.Select(file => new AssemblyScan(file)).Where(assembly => !assembly.CouldNotLoad())
                .Append(new AssemblyScan(typeof(int).Assembly));
        }
    }
}