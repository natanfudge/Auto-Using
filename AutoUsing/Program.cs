using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using Microsoft.VisualBasic;
using Newtonsoft.Json;

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

		const string fileLoc = @"C:\Users\natan\Desktop\Auto-Using\src\csReferences.ts";

		static void Main(string[] args)
		{


			var json = JsonConvert.SerializeObject(ReferenceScanner.GetAllReferences(), Formatting.Indented);


			File.WriteAllText(fileLoc, $"export const references = {json};");



			




		}








		// private string GetPath(){

		// }

	}

	public class Amar { }
}
