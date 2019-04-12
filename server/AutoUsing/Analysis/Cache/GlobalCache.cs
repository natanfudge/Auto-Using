using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using AutoUsing.Analysis.DataTypes;
using AutoUsing.Utils;

namespace AutoUsing.Analysis.Cache
{
    /// <summary>
    /// Completion cache of all of the base C# libraries
    /// </summary>
    public static class GlobalCache
    {
        public static CompletionCaches Caches;

        public static void SetupGlobalCache(string location)
        {
            Caches = new CompletionCaches
            {
                Types = new Cache<DataTypes.TypeCompletionInfo>(Path.Combine(location, "cache", "types.json")),
                Extensions = new Cache<ExtensionMethodInfo>(Path.Combine(location, "cache", "extensions.json")),
                Hierachies = new Cache<HierarchyInfo>(Path.Combine(location, "cache", "hierachies.json"))
            };

            if (Caches.Types.IsEmpty() || Caches.Hierachies.IsEmpty() || Caches.Extensions.IsEmpty())
            {
                // Scan .NET libraries
                var scanners = GetBaseAssemblyScans();
                Util.Log("Global cache reloading");
                Util.Verbose($"Paths to global cache: {scanners.Select(scan => scan.Path).ToIndentedJson()}");
                Caches.LoadScanResults(scanners);
            }
        }



        /// <summary>
        /// Gets location of the .NET base assemblies
        /// </summary>
        private static string[] GetBinFiles()
        {
#if DEBUG
            //HARDCODED
            var dotnetDir = @"C:\Program Files\dotnet\shared\Microsoft.NETCore.App\2.1.9";
#else
            var dotnetDir = Directory.GetParent(typeof(int).Assembly.Location).FullName;
#endif
            var files = Directory.GetFiles(dotnetDir, "*.dll");
            return files;
        }


        private static IEnumerable<AssemblyScan> GetBaseAssemblyScans()
        {
            // Util.WaitForDebugger();
            var bins = GetBinFiles();

            var scans = bins.Select(file =>
            {
                return new AssemblyScan(file);
            });

            scans = scans.Where(assembly => !assembly.CouldNotLoad())
                .Append(new AssemblyScan(typeof(int).Assembly));

            return scans;
        }
    }
}