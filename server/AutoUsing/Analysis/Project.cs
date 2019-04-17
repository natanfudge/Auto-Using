using System.Threading.Tasks;
using System.Threading;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml;
using AutoUsing.Analysis.Cache;
using AutoUsing.Analysis.DataTypes;
using Newtonsoft.Json.Linq;
using AutoUsing.Utils;
using Newtonsoft.Json;

namespace AutoUsing.Analysis
{
    /// <summary>
    ///     Loads and keeps `.csproj` file's data.
    ///     Optional: Watch the `.csproj` file for changes.
    /// </summary>
    public class Project : IDisposable
    {
        private XmlDocument Document { get; set; }

        //TODO: explain the purpose of this field
        private XmlNamespaceManager NamespaceManager { get; set; }
        private FileWatcher ProjectFileWatcher { get; set; }
        private FileWatcher AssetsFileWatcher { get; set; }

        /// <summary>
        /// The list of library names that are referenced by the .csproj file 
        /// </summary>
        public List<PackageReference> References { get; set; }

        /// <summary>
        /// The locations of the assemblies of the libraries in the .csproj file
        /// </summary>
        public IEnumerable<Library> LibraryAssemblyLocations { get; set; }

        /// <summary>
        /// The directory of the project file
        /// </summary>
        public string RootDirectory { get; private set; }

        /// <summary>
        /// The file name of the .csproj file NOT including the extension
        /// </summary>
        /// 
        public string Name { get; private set; }

        /// <summary>
        /// The location of the nuget packages
        /// </summary>
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
        /// <param name= "storageDirectory">The location at which project-specific cache files will be stored</param>
        public Project(string filePath, string storageDirectory, bool watch)
        {
            Document = new XmlDocument();
            References = new List<PackageReference>();

            // Namespace for msbuild.
            NamespaceManager = new XmlNamespaceManager(Document.NameTable);
            NamespaceManager.AddNamespace("x", "http://schemas.microsoft.com/developer/msbuild/2003");

            // Essential info about a given project file.
            LoadBasicInfo(filePath);

            // Using NuGet Packages Location, we won't need to wait for project
            // builds to get completions for referenced dependencies. As we'll query
            // the dlls directly from the NuGet installation folder set by the user.
            LoadNuGetRootDirectory();

            // Loads the relative pathes to the dll files for each referenced package.
            LoadLibraryAssemblyLocations();

            // Package References
            LoadPackageReferences();

            // Optional: Watch for changes.
            if (watch)
            {
                WatchProjectFile();
                WatchAssetsFile();
            }

            // Loads completion info from cache files
            LoadCache(storageDirectory);

            // startTime.LogTimePassed("Project Creation");
        }

        private void LoadCache(string vscodeDir)
        {
            Caches = new CompletionCaches
            {
                Types = new Cache<TypeCompletionInfo>(GetCacheLocation("types", vscodeDir)),
                Extensions = new Cache<ExtensionMethodInfo>(GetCacheLocation("extensions", vscodeDir)),
                Hierachies = new Cache<HierarchyInfo>(GetCacheLocation("hierarchies", vscodeDir))
            };

            UpdateCache();
        }

        private string GetCacheLocation(string type, string storageDir)
        {
            return Path.Combine(storageDir, "cache", Name, $"{type}.json");
        }


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
        /// The amount of time that only a single file change will be recorded in
        /// </summary>
        private const int watchBuffer = 300;

        private bool projectFileChangedRecently = false;

        // private string Get

        /// <summary>
        ///     Starts watching the project file for changes.
        /// </summary>
        private void WatchProjectFile()
        {
            ProjectFileWatcher = new FileWatcher(FilePath);
            ProjectFileWatcher.Changed += (s, e) =>
            {
                // Prevent the event from getting triggered twice.
                if (projectFileChangedRecently) return;
                projectFileChangedRecently = true;
                Task.Delay(watchBuffer).ContinueWith((t) =>
                {
                    projectFileChangedRecently = false;

                    if (e.ChangeType is WatcherChangeTypes.Renamed) LoadBasicInfo(e.Name);

                    if (e.ChangeType is WatcherChangeTypes.Deleted)
                    {
                        Dispose();
                        return;
                    }

                    if (e.ChangeType is WatcherChangeTypes.Changed)
                    {
                        // LoadLibraryAssemblyLocations();
                        LoadPackageReferences();
                        UpdateCache();
                    }
                });
            };
            ProjectFileWatcher.EnableRaisingEvents = true;
        }

        private bool assetsFileChangedRecently = false;

        /// <summary>
        ///     Starts watching the project.assets.json file for changes.
        /// </summary>
        private void WatchAssetsFile()
        {
            var location = AssetsFileLocation();
            // Util.Log("Watching location: " + location);
            AssetsFileWatcher = new FileWatcher(location);
            AssetsFileWatcher.Changed += (s, e) =>
            {
                // Prevent the event from getting triggered twice.
                if (assetsFileChangedRecently) return;
                assetsFileChangedRecently = true;
                Task.Delay(watchBuffer).ContinueWith((t) =>
                {
                    assetsFileChangedRecently = false;

                    if (e.ChangeType is WatcherChangeTypes.Changed)
                    {
                        LoadLibraryAssemblyLocations();
                        LoadPackageReferences();
                        UpdateCache();
                    }
                });
            };
            AssetsFileWatcher.EnableRaisingEvents = true;
        }

        private string AssetsFileLocation() => Path.Combine(RootDirectory, "obj/project.assets.json");

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
            if (!File.Exists(AssetsFileLocation()))
            {
                // Someone fucked with the assets file completely
                if (LibraryAssemblyLocations == null) LibraryAssemblyLocations = new List<Library>();
                return;
            }
            try
            {
                LoadLibraryAssemblyLocationsChecked();
            }
            catch (JsonReaderException)
            {
                // Someone fucked with the assets file a bit
                if (LibraryAssemblyLocations == null) LibraryAssemblyLocations = new List<Library>();
            }
        }

        private void LoadLibraryAssemblyLocationsChecked()
        {
            var assets = JObject.Parse(File.ReadAllText(AssetsFileLocation()));

            // TODO: Need to see what we do when we have multiple targets
            var targets = assets["targets"];
            var targetLibs = targets.First().First();

            // Util.WaitForDebugger();

            var locations = targetLibs.Select(lib =>
            {
                var (name, version) = ((JProperty)lib).Name.Split("/");

                // The json node that stores the dependencies, and some other things.
                var infoNode = lib.First();
                // The assembly locations live in the "compile" node
                var assemblies = infoNode["compile"]?.Select(assembly => ((JProperty)assembly).Name).ToList();



                RemoveNonsensePaths(assemblies,name : name, version : version);

                var dependencies = infoNode["dependencies"]
                   ?.Select(dependencyNode =>
                    {
                        var dependency = dependencyNode as JProperty;
                        // Sometimes there are square brackets that need to be removed.
                        var dependencyVersion = ((JValue)dependency.First()).Value.ToString().Replace("[", "").Replace("]", "");
                        return new LibraryIdentifier(dependency.Name, dependencyVersion);
                    });

                // Return empty enumerables instead of nulls
                return new Library(new LibraryIdentifier(name, version), assemblies ?? Enumerable.Empty<string>(), dependencies ?? Enumerable.Empty<LibraryIdentifier>());
            });
            // // We are not interested in libraries with no assemblies
            // .Where(library => library.Assemblies.Any());




            this.LibraryAssemblyLocations = locations;
        }

        /// <summary>
        /// Sometimes the assets file gives a path of the form "a/b/c/_._" which is not an actual file.
        /// Sometimes there is no path.
        /// Sometimes the path is a base class library and is not in the nuget folder.
        /// Removes all of the paths that are of these cases.
        /// </summary>
        private void RemoveNonsensePaths(List<string> paths,   string name, string version)
        {

            if(name.StartsWith("System.")){
                // Base class library
                paths?.RemoveAll();
                return;
            }

            paths?.RemoveAll(path =>{
                var pathParts = path.Split("/");
                
                // if(pathParts[0] == "ref") return true;
                // nonsense _._
                if(pathParts.Last() == "_._") return true;
                return false;
                // var fullPath = Path.Combine(NuGetPackageRoot,name.ToLower(),version, path).ParseEnvironmentVariables();
                // return !File.Exists(fullPath);
            } );
            //  || ;
            // return paths.First().Split("/").Last() == "_._";
        }

        // public void x<T>() where T :class{

        // }


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

            // Util.WaitForDebugger();

            foreach (XmlNode node in Document.SelectNodes("//PackageReference"))
            {
                var packageName = node?.Attributes?.GetNamedItem("Include")?.InnerText;
                var packageVersion = node?.Attributes?.GetNamedItem("Version")?.InnerText;

                if (packageName.IsNullOrEmpty() || packageVersion.IsNullOrEmpty()) continue;

                


                var libraryName = new LibraryIdentifier(packageName, packageVersion);
                AddReferencesOfLibrary(libraryName);

            }
        }


        /// <summary>
        /// Recursively adds the assemblies of a library and its dependencies
        /// </summary>
        /// <param name="libraryIdentifier">The identifier of the library</param>
        private void AddReferencesOfLibrary(LibraryIdentifier libraryIdentifier)
        {
            var library = LibraryAssemblyLocations.FirstOrDefault(lib => lib.Matches(libraryIdentifier));
            if (library == null)
            {
                Util.Log(
                    $@"Could not find the assembly path of a newly added library '{libraryIdentifier}' in projects.assets.json.
                    This is probably because the dependencies were not restored yet.");
                return;
            }


            var packageName = libraryIdentifier.Name;
            var packageVersion = libraryIdentifier.Version.ToString();

            var packagePath = Path.Combine(NuGetPackageRoot, $"{packageName}/{packageVersion}/");

            // Add references of current library
            foreach (var assemblyPath in library.Assemblies)
            {
                References.AddIfNotContains(new PackageReference
                {
                    Name = packageName,
                    Version = packageVersion,
                    Path = Path.Combine(packagePath, assemblyPath)
                });
            }

            // Recursively add the references of the dependencies
            foreach (var dependency in library.Dependencies)
            {
                AddReferencesOfLibrary(dependency);
            }
        }


        /// <summary>
        /// Adds all of the new data about the references to the cache
        /// </summary>
        /// <param name="oldReferences"></param>
        private void UpdateCache()
        {
            // Util.WaitForDebugger();
            // Gets the intersection in case one of the cache files is missing something
            var oldPackages = GetOldCacheIntersection().ToList();
            var newPackages = this.References.Select(reference => reference.Path.ParseEnvironmentVariables());

            var filtered = newPackages.Where(p => p.Contains("ObjectModel"));
            // Add new packages to cache
            var addedPackages = newPackages.Except(oldPackages);
            var scans = addedPackages.Select(package => new AssemblyScan(package))
                .Where(scanner => !scanner.CouldNotLoad());
            Caches.AppendScanResults(scans);

            // Delete packages that no longer exist from the cache
            var deletedPackages = oldPackages.Except(newPackages);
            Caches.DeletePackages(deletedPackages);

            LogPackageChange(oldPackages, newPackages, addedPackages, deletedPackages);
        }

        private IEnumerable<string> GetOldCacheIntersection()
        {
            return Caches.Types.GetIdentifiers().Intersect(Caches.Hierachies.GetIdentifiers())
                .Intersect(Caches.Extensions.GetIdentifiers());
        }

        private static void LogPackageChange(IEnumerable<string> oldPackages, IEnumerable<string> newPackages,
            IEnumerable<string> addedPackages, IEnumerable<string> removedPackages)
        {
            if (oldPackages.Count() != newPackages.Count())
            {
                Util.Log("Old packages : " + oldPackages.ToIndentedJson());
                Util.Log("New packages : " + newPackages.ToIndentedJson());

                if (addedPackages.Any()) Util.Log("Adding packages: " + addedPackages.ToIndentedJson());
                if (removedPackages.Any()) Util.Log("Removing packages : " + removedPackages.ToIndentedJson());
            }
        }

        /// <summary>
        ///     Stops the <see cref="ProjectFileWatcher"/> used by this instance
        ///     before disposal.
        /// </summary>
        public void Dispose()
        {
            ProjectFileWatcher.EnableRaisingEvents = false;
            ProjectFileWatcher?.Dispose();
            AssetsFileWatcher.EnableRaisingEvents = false;
            AssetsFileWatcher?.Dispose();
        }
    }
}