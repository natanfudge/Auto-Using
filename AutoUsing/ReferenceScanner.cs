using System.Threading;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;
using System;
using System.IO;
using System.Linq;
namespace AutoUsing
{

	

	public class ReferenceScanner
	{
		// string x;
		

		public static FileInfo[] GetBinFiles()
		{
			return new DirectoryInfo(Util.GetParentDir(typeof(int).Assembly.Location)).GetFiles("*.dll");
		}


		public static string GetAllReferences()
		{
			var bins = GetBinFiles();
			var assemblies = bins.Select(file =>
			{
				try
				{
					return Assembly.LoadFile(file.FullName);
				}
				catch (BadImageFormatException)
				{
					return null;
				}

			}).Where(assembly => assembly != null).Append(typeof(int).Assembly);



			var referenceList = string.Join("\n",assemblies.Select(assembly =>
			{
				var types = assembly.GetExportedTypes().Select(type =>
					{
						var neededAssemblyInfo = $"{WithoutTilde(type.Name)} {type.Namespace}";
						return neededAssemblyInfo;
					}).Where(typeStr => typeStr != null).ToList();
				return string.Join("\n",types);
			})).Split("\n").Distinct().ToList();

			return string.Join("\n",referenceList);


			


			// var neededInfo = bins.Select(file =>
			// // {
			// // 	try
			// // 	{
			// // 		var assembly = Assembly.LoadFile(file.FullName);


			// // 	}
			// // 	catch ()
			// // 	{
			// // 		return null;
			// // 	}
			// // }).Where(info => info != null && info.Count > 0).ToList();

			// var lines = string.Join("\n", neededInfo.Select(referenceList => string.Join("\n", referenceList))).Split("\n");
			// var linesDistinct = lines.Distinct().ToList();

			// var finalStr = string.Join("\n", linesDistinct);


			// return finalStr;

		}

		// public static bool IsVisualBasic(string nameSpace){
		//     return nameSpace.
		// }

		public static string WithoutTilde(string str)
		{
			if (str.Length < 2) return str;

			var possibleTilde = str[str.Length - 2];
			if (possibleTilde == '`')
			{
				return str.Substring(0, str.Length - 2);
			}

			if (str.Length < 3) return str;
			possibleTilde = str[str.Length - 3];
			if (possibleTilde == '`')
			{
				return str.Substring(0, str.Length - 3);
			}

			return str;
		}
	}
}