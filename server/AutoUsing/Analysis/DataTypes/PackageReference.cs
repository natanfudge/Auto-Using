using System;
namespace AutoUsing.Analysis.DataTypes
{
    /// <summary>
    ///     Represents a NuGet package reference information.
    /// </summary>
    public class PackageReference
    {
        public string Name { get; set; }
        public string Version { get; set; }
        public string Path { get; set; }

        public override bool Equals(object obj)
        {
            return obj is PackageReference reference &&
                   Version == reference.Version &&
                   Path == reference.Path;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Version, Path);
        }



    }
}