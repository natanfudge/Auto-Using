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
                new Cache<ReferenceInfo>("C:/Users/natan/Desktop/Auto-Using-Git/out/cache/references.json")
            //TODO extensions, hierachies
        };

        static GlobalCache()
        {
            var scanners = GetBaseAssemblies();

            if (Caches.Types.IsEmpty())
            {
                Caches.LoadScanResults(scanners); 
            }
        }


        private static string[] GetBinFiles()
        {
            var dotnetDir = Directory.GetParent(typeof(int).Assembly.Location);
            var files = Directory.GetFiles(dotnetDir.FullName, "*.dll");
            return files;
        }

        private static IEnumerable<AssemblyScanner> GetBaseAssemblies()
        {
            var bins = GetBinFiles();
            return bins.Select(file => new AssemblyScanner(file)).Where(assembly => assembly.CouldNotLoad())
                .Append(new AssemblyScanner(typeof(int).Assembly));
        }
    }
}