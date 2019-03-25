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
            var reference = obj as PackageReference;
            return reference != null &&
                   Name == reference.Name &&
                   Version == reference.Version &&
                   Path == reference.Path;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Name, Version, Path);
        }

        // public PackageReference(PackageReference toClone){
        //     Name = toClone.Name;
        //     Version = toClone.Version;
        //     Path = toClone.Path;
        // }


    }
}