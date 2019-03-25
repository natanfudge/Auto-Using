using System.Threading;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml;
using AutoUsing.Analysis.Cache;
using AutoUsing.Analysis.DataTypes;
using Newtonsoft.Json.Linq;

namespace AutoUsing.Analysis
{
    /// <summary>
    ///     Loads and keeps `.csproj` file's data.
    ///     Optional: Watch the `.csproj` file for changes.
    /// </summary>
    public class Project : IDisposable
    {
        private XmlDocument Document { get; set; }
        private XmlNamespaceManager NamespaceManager { get; set; }
        private FileWatcher FileWatcher { get; set; }

        /// <summary>
        /// The list of library classes that are referenced by the .csproj file 
        /// </summary>
        public List<PackageReference> References { get; set; }
        public Dictionary<string, List<string>> LibraryAssemblies { get; set; }
        public string RootDirectory { get; private set; }
        /// <summary>
        /// The file name of the .csproj file NOT including the extension
        /// </summary>
        public string Name { get; private set; }
        public string NuGetPackageRoot { get; private set; }
        /// <summary>
        /// The full path to the .csproj file
        /// </summary>
        public string FilePath { get; private set; }
        /// <summary>
        /// The file name of the .csproj file including the extension
        /// </summary>
        public string FileName { get; private set; }

        public CompletionCaches Caches { get; private set; }


        /// <summary>
        ///     Loads and keeps `.csproj` file's data.
        ///     Optional: Watch the `.csproj` file for changes.
        /// </summary>
        /// <param name="filePath">The path to the `.csproj` file to laod.</param>
        /// <param name="watch">Whether to watch for further file changes.</param>
        public Project(string filePath, bool watch)
        {
            var startTime = DateTime.Now;

            Document = new XmlDocument();
            References = new List<PackageReference>();

            // Namespace for msbuild.
            NamespaceManager = new XmlNamespaceManager(Document.NameTable);
            NamespaceManager.AddNamespace("x", "http://schemas.microsoft.com/developer/msbuild/2003");

            // Essential info about given project file.
            LoadBasicInfo(filePath);

            // Using NuGet Packages Location, We won't need to wait for project
            // builds to get completions for referenced dependencies. As we'll query
            // the dlls directly from the NuGet installation folder set by the user.
            LoadNuGetRootDirectory();

            // Loads the relative pathes to the dll files for each referenced package.
            LoadLibraryAssemblyLocations();

            // Package References
            LoadPackageReferences();

            // Optional: Watch for changes.
            if (watch) Watch();

            // Loads completion info from cache files
            LoadCache();

            startTime.LogTimePassed("Project Creation");
        }

        private void LoadCache()
        {

            Caches = new CompletionCaches
            {
                Types = new Cache<ReferenceInfo>(GetCacheLocation("references")),
                Extensions = new Cache<ExtensionMethodInfo>(GetCacheLocation("extensions")),
                Hierachies = new Cache<HierarchyInfo>(GetCacheLocation("hierarchies"))
            };

            // if (Caches.Types.IsEmpty() || Caches.Extensions.IsEmpty() || Caches.Hierachies.IsEmpty())
            // {
            //     var scanners = References.Select(reference => new AssemblyScan(reference.Path));
            //     Caches.LoadScanResults(scanners);
            // }else{

            // }

            UpdateCache();
        }

        // TODO: probably change this to somewhere more hidden
        private string GetCacheLocation(string type) =>
            Path.Combine(Directory.GetParent(FilePath).FullName, "_autousingcache", $"{Name}_{type}.json");

        /// <summary>
        ///     Loads the basic info about the specified project file.
        /// </summary>
        /// <param name="filePath">Full path to the project's `.csproj` file.</param>
        private void LoadBasicInfo(string filePath)
        {
            RootDirectory = Path.GetDirectoryName(filePath);
            Name = Path.GetFileNameWithoutExtension(filePath);
            FileName = Path.GetFileName(filePath);
            FilePath = filePath;
        }

        /// <summary>
        ///     Starts watching the project file for changes.
        /// </summary>
        private void Watch()
        {
            FileWatcher = new FileWatcher(FilePath);
            FileWatcher.Changed += (s, e) =>
            {
                if (e.ChangeType is WatcherChangeTypes.Renamed) LoadBasicInfo(e.Name);

                if (e.ChangeType is WatcherChangeTypes.Deleted)
                {
                    Dispose();
                    return;
                }

                // var oldReferences = References;

                LoadPackageReferences();
                UpdateCache();
            };
            FileWatcher.EnableRaisingEvents = true;
        }

        /// <summary>
        ///     Gets the current NuGet packages installation directory
        ///     used by this project.
        /// </summary>
        private void LoadNuGetRootDirectory()
        {
            Document.Load(Path.Combine(RootDirectory, $"obj/{Name}.csproj.nuget.g.props"));

            NuGetPackageRoot = Document.SelectSingleNode("//x:NuGetPackageRoot", NamespaceManager)?.InnerText;
        }

        /// <summary>
        ///     Loads the relative dll paths of all the libraries of the project.
        /// </summary>
        private void LoadLibraryAssemblyLocations()
        {
            var assets = JObject.Parse(File.ReadAllText(Path.Combine(RootDirectory, "obj/project.assets.json")));

            // TODO: Need to see what we do when we have multiple targets
            var targets = assets["targets"];
            var targetLibs = targets.First().First();

            LibraryAssemblies = targetLibs
                .ToDictionary(lib => ((JProperty)lib).Name,
                    lib => { return lib.First()["compile"]?.Select(assembly => ((JProperty)assembly).Name).ToList(); })
                .Where(kv => kv.Value != null).ToDictionary();
        }

        /// <summary>
        ///     Loads full package info for each reference of the project.
        /// </summary>
        private void LoadPackageReferences()
        {
            try
            {
                Util.WaitForFileToBeAccessible(FilePath);
                Document.Load(FilePath);
            }
            catch (XmlException e)
            {
                throw new Exception($@"Error parsing the xml file located at ${FilePath}:
                 Call stack: ${e}");
            }


            References = new List<PackageReference>();

            foreach (XmlNode node in Document.SelectNodes("//PackageReference"))
            {
                var packageName = node?.Attributes?.GetNamedItem("Include")?.InnerText;
                var packageVersion = node?.Attributes?.GetNamedItem("Version")?.InnerText;

                if (packageName.IsNullOrEmpty() || packageVersion.IsNullOrEmpty()) continue;

                var packagePath = Path.Combine(NuGetPackageRoot, $"{packageName}/{packageVersion}/");

                foreach (var assemblyPath in LibraryAssemblies[packageName + "/" + packageVersion])
                {
                    References.Add(new PackageReference
                    {
                        Name = packageName,
                        Version = packageVersion,
                        Path = Path.Combine(packagePath, assemblyPath)
                    });
                }
            }
        }


        /// <summary>
        /// Adds all of the new data about the references to the cache
        /// </summary>
        /// <param name="oldReferences"></param>
        //TODO: this is getting called twice for some reason. FIX IT!!
        private void UpdateCache()
        {
            // The identifiers are identical so it doesn't matter where we get this list from.
            // Either way it gets all of the packages from before changes were made. 
            var oldPackages = Caches.Types.GetIdentifiers();
            var newPackages = this.References.Select(reference => reference.Path);

            Util.Log("Old packages : " + oldPackages.ToIndentedJson());
            Util.Log("New packages : " + newPackages.ToIndentedJson());

            // Add new packages to cache
            var addedPackages = newPackages.Except(oldPackages);
            Util.Log("Adding packages: " + addedPackages.ToIndentedJson());
            if (newPackages.Count() > 0)
            {
                var scans = addedPackages.Select(package => new AssemblyScan(package)).Where(scanner => !scanner.CouldNotLoad());
                Caches.AppendScanResults(scans);
            }

            // Delete packages that no longer exist from the cache
            var deletedPackages = oldPackages.Except(newPackages);
            // Util.Log("DELETED PACKAGES: \n" + deletedPackages.ToIndentedJson());
            if (newPackages.Count() > 0)
            {
                Caches.DeletePackages(deletedPackages);
            }

        }

        /// <summary>
        ///     Stops the <see cref="FileWatcher"/> used by this instance
        ///     before disposal.
        /// </summary>
        public void Dispose()
        {
            FileWatcher.EnableRaisingEvents = false;
            FileWatcher?.Dispose();
        }
    }
}