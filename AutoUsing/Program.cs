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
        static StdProxy Proxy { get; set; }
        static AssemblyScanner Scanner { get; set; }

        static void Main(string[] args)
        {
            Proxy = new StdProxy();

            Proxy.EditorDataReceived += (s, e) =>
            {
                /*
                    {"Command":"ping","Arguments":""}
                    {"Command":"scan","Arguments":"/Volumes/Workspace/csharp-extensions/Auto-Using/AutoUsing/bin/Debug/netcoreapp2.1/AutoUsing.dll"}
                    {"Command":"getAllTypes","Arguments":""}
                    ...
                */
                Request req = e.Data;

                switch (req.Command)
                {
                    case "scan":
                        Scanner = new AssemblyScanner();

                        bool loadingSuccessfull = Scanner.LoadAssembly(req.Arguments);
                        if (!loadingSuccessfull) Proxy.WriteData(Errors.CannotLoadAssembly, false);

                        Proxy.WriteData();
                        break;
                    case "getAllTypes":
                        if (Scanner is null) Proxy.WriteData(Errors.LoadAssemblyFirst, false);

                        Proxy.WriteData(Scanner.GetAllTypes());
                        break;
                    case "getAllExtensionMethods":
                        if (Scanner is null) Proxy.WriteData(Errors.LoadAssemblyFirst, false);

                        Proxy.WriteData(Scanner.GetAllExtensionMethods());
                        break;
                    case "getAllHierarchies":
                        if (Scanner is null) Proxy.WriteData(Errors.LoadAssemblyFirst, false);
                            
                        Proxy.WriteData(Scanner.GetAllHierarchies());
                        break;
                    case "ping":
                        Proxy.WriteData("pong");
                        break;
                }
            };

            while (true)
            {
                Proxy.ReadData(new MessageEventArgs { Data = Console.ReadLine() });
            }

            // var assemblyScanner = new AssemblyScanner();
            // var referencesJson = JsonConvert.SerializeObject(assemblyScanner.GetAllTypes(), Formatting.Indented);
            // var extensionsJson = JsonConvert.SerializeObject(assemblyScanner.GetAllExtensionMethods(), Formatting.Indented);
            // var hierachiesJson = JsonConvert.SerializeObject(assemblyScanner.GetAllHierarchies(), Formatting.Indented);

            // File.WriteAllText(csreferences, $"export const _CSHARP_REFERENCES = {referencesJson};");
            // File.WriteAllText(extensionMethods, $"export const _CSHARP_EXTENSION_METHODS : ExtendedClass[] = {extensionsJson};");
            // File.WriteAllText(hierachies, $"export const _CSHARP_CLASS_HIEARCHIES : ClassHiearchies[] = {hierachiesJson};");
        }
    }
}
