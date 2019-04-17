using System.Linq;
using System.Collections.Generic;
using AutoUsing.Utils;
using System;

namespace AutoUsing.Analysis.DataTypes
{
    public class Library
    {
        public Library(LibraryIdentifier identifier, IEnumerable<string> assemblies, IEnumerable<LibraryIdentifier> dependencies)
        {
            Identifier = identifier;
            Assemblies = assemblies;
            Dependencies = dependencies;
        }

        public LibraryIdentifier Identifier { get; set; }
        public IEnumerable<string> Assemblies { get; set; }
        public IEnumerable<LibraryIdentifier> Dependencies { get; set; }

        public override bool Equals(object obj)
        {
            return obj is Library library &&
                   EqualityComparer<LibraryIdentifier>.Default.Equals(Identifier, library.Identifier) &&
                   Assemblies.SequenceEqual(library.Assemblies) &&
                   Dependencies.SequenceEqual(library.Dependencies);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Identifier, Assemblies, Dependencies);
        }

        /// <summary>
        /// Returns true if this library has the same name as the parameter, and the version is at least the one of the parameter.
        /// </summary>
        public bool Matches(LibraryIdentifier identifier)
        {
            return identifier.Name == this.Identifier.Name;
        }

    }


    public class LibraryIdentifier
    {
        public LibraryIdentifier(string name, string version)
        {
            Name = name;
            Version = version;
        }

        public string Name { get; set; }
        public string Version { get; set; }



        public override string ToString()
        {
            return $"LibraryName{{Name = {Name}, Version = {Version}}}";
        }
    }

    // public class Version
    // {
    //     public int Major { get; set; }
    //     public int Minor { get; set; }
    //     public int Patch { get; set; }

    //     public int? BetaVersion { get; set; } = null;

    //     /// <summary>
    //     /// Parses a version string of the form "x.y.z" to a version object
    //     /// </summary>
    //     public Version(string version)
    //     {
    //         var (major, minor, patch) = version.Split(".");
    //         this.Major = int.Parse(major);
    //         this.Minor = int.Parse(minor);

    //         // Versions sometimes have a '-betax' appended to them so we parse x that as the version.
    //         // For example "8.2.1-beta2".
    //         var betaSplit = patch.Split("-beta");
    //         this.Patch = int.Parse(betaSplit[0]);
    //         // In this case it does have a beta version appended
    //         if (betaSplit.Length > 1)
    //         {
    //             this.BetaVersion = int.Parse(betaSplit[1]);
    //         }
    //     }

    //     /// <summary>
    //     /// Returns whethever or not this version is a later (or the same) version than another one.
    //     /// </summary>
    //     public bool IsAtleast(Version other)
    //     {
    //         if (this.Major > other.Major) return true;
    //         else if (this.Major < other.Major) return false;
    //         // this.Major == other.Major
    //         else
    //         {
    //             if (this.Minor > other.Minor) return true;
    //             else if (this.Minor < other.Minor) return false;
    //             // this.Major == other.Major AND this.Minor == other.Minor
    //             else
    //             {
    //                 if (this.Patch > other.Patch) return true;
    //                 else if (this.Patch < other.Patch) return false;
    //                 // this.Major == other.Major AND this.Minor == other.Minor AND this.Patch == other.Patch
    //                 else
    //                 {
    //                     // Beta versions of a specific version are considered earlier versions of the release one.
    //                     if (this.BetaVersion != null)
    //                     {
    //                         if (other.BetaVersion == null) return false;
    //                         // Both are beta versions
    //                         return this.BetaVersion >= other.BetaVersion;
    //                     }
    //                     else
    //                     // other.BetaVersion == null
    //                     {
    //                         if (other.BetaVersion != null) return true;
    //                         // If it got here it means they are exactly identical
    //                         return true;
    //                     }
    //                 }

    //             }
    //         }
    //     }

    //     public override bool Equals(object obj)
    //     {
    //         return obj is Version version &&
    //                Major == version.Major &&
    //                Minor == version.Minor &&
    //                Patch == version.Patch &&
    //                EqualityComparer<int?>.Default.Equals(BetaVersion, version.BetaVersion);
    //     }

    //     public override int GetHashCode()
    //     {
    //         return HashCode.Combine(Major, Minor, Patch, BetaVersion);
    //     }

    //     public override string ToString()
    //     {
    //         var betaVersion = BetaVersion == null ? "" : $"-beta{BetaVersion}";
    //         return $"{Major}.{Minor}.{Patch}{betaVersion}";
    //     }
    // }
}