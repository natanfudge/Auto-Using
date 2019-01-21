﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml;

namespace AutoUsing
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

        public List<PackageReference> References { get; set; }
        public string RootDirectory { get; private set; }
        public string Name { get; private set; }
        public string NuGetPackageRoot { get; private set; }
        public string FilePath { get; private set; }
        public string FileName { get; private set; }

        /// <summary>
        ///     Loads and keeps `.csproj` file's data.
        ///     Optional: Watch the `.csproj` file for changes.
        /// </summary>
        /// <param name="filePath">The path to the `.csproj` file to laod.</param>
        /// <param name="watch">Whether to watch for further file changes.</param>
        public Project(string filePath, bool watch)
        {
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

            // Package References
            LoadPackageReferences();

            // Optional: Watch for changes.
            if (watch) Watch();
        }

        private void LoadBasicInfo(string filePath)
        {
            RootDirectory = Path.GetDirectoryName(filePath);
            Name = Path.GetFileNameWithoutExtension(filePath);
            FileName = Path.GetFileName(filePath);
            FilePath = filePath;
        }

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

                LoadPackageReferences();
            };
            FileWatcher.EnableRaisingEvents = true;
        }

        private void LoadNuGetRootDirectory()
        {
            Document.Load(Path.Combine(RootDirectory, $"obj/{Name}.csproj.nuget.g.props"));

            NuGetPackageRoot = Document.SelectSingleNode("//x:NuGetPackageRoot", NamespaceManager)?.InnerText;
        }

        public void LoadPackageReferences()
        {
            Document.Load(FilePath);

            foreach (XmlNode node in Document.SelectNodes("//PackageReference"))
            {
                var packageName = node?.Attributes?.GetNamedItem("Include")?.InnerText;
                var packageVersion = node?.Attributes?.GetNamedItem("Version")?.InnerText;

                if (packageName.IsNullOrEmpty() || packageVersion.IsNullOrEmpty()) continue;

                // TODO - Need a way to determine which target dll is used.
                var packagePath = Path.Combine(NuGetPackageRoot, $"{packageName}/{packageVersion}/");

                // ? IDK ABOUT THIS YET.
                References = new List<PackageReference>();
                References.Add(new PackageReference { Name = packageName, Version = packageVersion, Path = packagePath });
            }
        }

        public void Dispose()
        {
            FileWatcher.EnableRaisingEvents = false;
            FileWatcher?.Dispose();
        }
    }
}