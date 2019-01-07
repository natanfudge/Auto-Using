using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using Microsoft.VisualBasic;

namespace AutoUsing
{
	class Program
	{


		private static Type[] TypesFrom(string path)
		{
			return Assembly.LoadFrom(path).GetTypes();
		}

		private static List<Type> GetAllTypes()
		{
			var types = typeof(int).Assembly.GetExportedTypes().ToList();
			types.AddRange(typeof(Console).Assembly.GetExportedTypes());
			types.AddRange(typeof(File).Assembly.GetExportedTypes());
			return types;
		}

        const string fileLoc = @"C:\Users\natan\Desktop\Auto-Using\AutoUsing\TypeInfoNew.txt";

		static void Main(string[] args)
		{


			// var types = GetAllTypes();

			// var infoFile = string.Join("\n", types.Select((type) =>
			//  {
			// 	 var typespace = type.Namespace;
			// 	 if (typespace.Equals("Internal")) return null;
			// 	 var name = type.Name;
			// 	 // Get rid of shitty tildes that appear when something is duplicated
			// 	 var possibleTilde = name.Length >= 2 ? name[name.Length - 2] : 'a';
			// 	 if (possibleTilde == '`') name = name.Substring(0, name.Length - 2);

			// 	 return $"{name} {typespace}";
			//  }).Distinct().Where(s => s != null));


			File.WriteAllText(fileLoc, ReferenceScanner.GetAllReferences());

			





		}

        
		

		



		// private string GetPath(){

		// }

	}

	public class Amar { }
}
