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


		public static List<Reference> GetAllReferences()
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

			var references = new List<KeyValuePair<string,string>>();

			foreach(var assembly in assemblies){
				foreach(var type in assembly.GetExportedTypes()){
					references.Add(new KeyValuePair<string, string>(WithoutTilde( type.Name),type.Namespace));
				}
			}


			var grouped = references.Distinct().GroupBy(kv => kv.Key).Select(group => new Reference(group.Key,group.Select(kv => kv.Value).ToList())).ToList();
			
			return grouped;


		}

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