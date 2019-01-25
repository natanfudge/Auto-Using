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
    }
}