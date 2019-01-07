using System.Reflection;
using System;
using System.IO;
using System.Linq;
namespace AutoUsing
{

	public class ReferenceScanner
	{

		public static FileInfo[] GetBinFiles()
		{
			return new DirectoryInfo(Util.GetParentDir(typeof(int).Assembly.Location)).GetFiles("*.dll");
		}
		public static string GetAllReferences()
		{
			var bins = GetBinFiles();
			var neededInfo = bins.Select(file =>
			{
				try
				{
					var assembly = Assembly.LoadFile(file.FullName);
                    
					var types = assembly.GetExportedTypes().Select(type =>
					{
						var neededAssemblyInfo = $"{WithoutTilde(type.Name)} {type.Namespace}";
						return neededAssemblyInfo;
					}).Where(typeStr => typeStr != null).ToList();
					return types;
				}
				catch (BadImageFormatException)
				{
					return null;
				}
			}).Where(info => info != null && info.Count > 0).ToList();

            var lines = string.Join("\n", neededInfo.Select(referenceList => string.Join("\n",referenceList))).Split("\n");
            var linesDistinct = lines.Distinct().ToList();

            var finalStr = string.Join("\n",linesDistinct);
       

			return finalStr;

		}

        // public static bool IsVisualBasic(string nameSpace){
        //     return nameSpace.
        // }

		public static string WithoutTilde(string str)
		{
			if (str.Length < 2) return str;

			var possibleTilde = str[str.Length - 2];
			if (possibleTilde == '`') return str.Substring(0, str.Length - 2);
            return str;
		}
	}
}