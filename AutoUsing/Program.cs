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

        const string csdata = @"C:\Users\natan\Desktop\Auto-Using\src\csdata\";

        const string csreferences = csdata + "csReferences.ts";
        const string extensionMethods = csdata + "csExtensionMethods.ts";
        const string hierachies = csdata + "csHierachies.ts";

        

        static void Main(string[] args)
        {
            var assemblyScanner = new AssemblyScanner();
            var referencesJson = JsonConvert.SerializeObject(assemblyScanner.GetAllReferences(), Formatting.Indented);
            var extensionsJson = JsonConvert.SerializeObject(assemblyScanner.GetAllExtensionMethods(), Formatting.Indented);
            var hierachiesJson = JsonConvert.SerializeObject(assemblyScanner.GetAllHierarchies(), Formatting.Indented);


            File.WriteAllText(csreferences, $"export const _CSHARP_REFERENCES = {referencesJson};");
            File.WriteAllText(extensionMethods, $"export const _CSHARP_EXTENSION_METHODS : ExtendedClass[] = {extensionsJson};");
            File.WriteAllText(hierachies, $"export const _CSHARP_CLASS_HIEARCHIES : ClassHiearchies[] = {hierachiesJson};");
            // y.ass


        }




    }

    public class Amar { }
}
