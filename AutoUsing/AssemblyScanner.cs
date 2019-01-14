using System.Threading;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;
using System;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using AutoUsing.datatypes;

namespace AutoUsing
{





    public class AssemblyScanner
    {

        private IEnumerable<Assembly> assemblies;

        public AssemblyScanner()
        {
            assemblies = GetAllAssemblies();
        }

        // string x;


        public static FileInfo[] GetBinFiles()
        {
            var dotnetDir = typeof(int).Assembly.Location;
            return new DirectoryInfo(Util.GetParentDir(dotnetDir)).GetFiles("*.dll");
        }

        private IEnumerable<Assembly> GetAllAssemblies()
        {
            var bins = GetBinFiles();
            return bins.Select(file =>
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

        }


        public List<ReferencePointer> GetAllReferences()
        {
            var references = assemblies.SelectMany(assembly => assembly.GetExportedTypes()
            .Select(type => new KeyValuePair<string, string>((type.Name).NoTilde(), type.Namespace)));

            var grouped = references.Distinct()
            .GroupBy(kv => kv.Key)
            .Select(group => new ReferencePointer(group.Key, group.Select(kv => kv.Value).ToList()))
            .ToList();

            return grouped;
        }

        public List<ClassHiearchies> GetAllHierarchies()
        {
            var hierachies = assemblies.SelectMany(assembly => assembly.GetExportedTypes()
            .Select(type =>
            {
                var baseClass = type.BaseType;
                var baseClassStr = baseClass != null ? baseClass.Namespace + "." + baseClass.Name.NoTilde() : "System.Object";
                var fathers = type.GetInterfaces().Select(@interface => @interface.Namespace + "." + @interface.Name.NoTilde())
                .Append(baseClassStr).ToList();

                var name = type.Name.NoTilde();
                if (type.IsGenericType) name += "<>";

                return new HiearchyInfo(name, type.Namespace, fathers);
            })).ToList();

            var easierFormat = hierachies.GroupBy(hierachy => hierachy.className)
            .Select(group => new ClassHiearchies(group.Key, group.Select(info => new NamespaceHiearchy(info.@namespace, info.fathers))
            .ToList())).OrderBy(classHierachies => classHierachies.@class).ToList();


            return easierFormat;
        }

        public List<ExtendedClass> GetAllExtensionMethods()
        {
            var allExtensionMethods = assemblies.SelectMany(GetExtensionMethods).ToList();

            var grouped = allExtensionMethods.GroupBy(ExtendedClassName)
            .Select(extensionMethods => extensionMethods.GroupBy(extensionMethod => extensionMethod.extendingMethod));

            var easierFormat = grouped.Select(extendedClass => new ExtendedClass(extendedClass.First().First().extendedClass,

            extendedClass.Select(extensionMethod => new ExtensionMethod(extensionMethod.First().extendingMethod,
             extensionMethod.Select(info => info.extendingNamespace).Distinct().ToList()))
            .Distinct().ToList())).ToList()
            .OrderBy(extendedClass => extendedClass.extendedClass).ToList();


            return easierFormat;
        }

        private static bool ClassCanHaveExtensionMethods(Type @class) => @class.IsSealed && !@class.IsGenericType && !@class.IsNested;

        private static string ExtendedClassName(ExtensionMethodInfo info) => (info.extendedClass).NoTilde();

        // private static string ExtendedClassNamespace(ExtensionMethodInfo info) => info.extendedNamespace;

        public static List<ExtensionMethodInfo> GetExtensionMethods(Assembly assembly)
        {
            var extendingClasses = assembly.GetExportedTypes().Where(ClassCanHaveExtensionMethods);

            var extensionMethods = extendingClasses.SelectMany(
                extendingClass => extendingClass.GetExtensionMethods()
                .Select(extendingMethod =>
                {
                    var extendedClass = extendingMethod.GetExtendedClass().Namespace + "." + extendingMethod.GetExtendedClass().Name.NoTilde();
                    // if (extendingMethod.GetExtendedClass().IsGenericType) extendedClass += "<>";
                    return new ExtensionMethodInfo(
                        extendingClass.Namespace,
                        extendingMethod.Name,
                        extendedClass
                     );
                })).ToList();

            return extensionMethods;
        }


        public static Type TargetType(MethodInfo method)
        {
            return method.GetParameters()[0].ParameterType;
        }

    }
}