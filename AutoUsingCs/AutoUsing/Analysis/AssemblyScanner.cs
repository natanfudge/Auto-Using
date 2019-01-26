using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using AutoUsing.Analysis.DataTypes;

namespace AutoUsing.Analysis
{
    public class AssemblyScanner
    {
        public AssemblyScanner(string path)
        {
            try
            {
                Assembly = Assembly.LoadFile(path.ParseEnvironmentVariables());
            }
            catch (Exception e)
            {
                if (e is BadImageFormatException || e is FileLoadException) Assembly = null;
                throw;
            }
        }

        public AssemblyScanner(Assembly assembly)
        {
            Assembly = assembly;
        }
        


        private Assembly Assembly { get; set; }

        public bool CouldNotLoad() => Assembly == null;


        public List<ReferenceInfo> GetAllTypes()
        {
            var references = Assembly.GetExportedTypes()
                .Select(type => new ReferenceInfo(type.Name.NoTilde(), type.Namespace))
                .ToList();

            return references;
        }


        

        //TODO split this into a method that returns raw HierachiesInfo here, and another one that converts
        // HierachiesInfo to Hierachies in CompletionCaches
        public List<Hierarchies> GetAllHierarchies()
        {
            var hierachies = Assembly.GetExportedTypes()
                .Select(type =>
                {
                    if (type.IsStatic()) return null;

                    var baseClass = type.BaseType;
                    var baseClassStr = baseClass != null
                        ? baseClass.Namespace + "." + baseClass.Name.NoTilde()
                        : "System.Object";
                    var fathers = type
                        .GetInterfaces()
                        .Select(@interface => @interface.Namespace + "." + @interface.Name.NoTilde())
                        .Append(baseClassStr)
                        .ToList();
                    var name = type.Name.NoTilde();

                    if (type.IsGenericType) name += "<>";

                    if (name.Equals("Array") && type.Namespace.Equals("System"))
                    {
                        fathers.AddRange(ArrayRuntimeImplementations);
                    }


                    return new HierarchyInfo(name, type.Namespace, fathers);
                })
                .Where(info => info != null).ToList();

            var easierFormat = hierachies
                .GroupBy(hierachy => hierachy.Name)
                .Select(group => new Hierarchies(group.Key,
                    group.Select(info => new Hierarchy(info.Namespace, info.Parents)).ToList()))
                .OrderBy(classHierachies => classHierachies.Name)
                .ToList();


            return easierFormat;
        }

        readonly List<string> ArrayRuntimeImplementations = new List<string>
        {
            "System.Collections.Generic.IList", "System.Collections.Generic.ICollection",
            "System.Collections.Generic.IEnumerable"
        };

        //TODO same thing as in hierachies
        public List<ExtensionClass> GetAllExtensionMethods()
        {
            var allExtensionMethods = GetExtensionMethods(Assembly);

            var grouped = allExtensionMethods
                .GroupBy(ExtendedClassName)
                .Select(extensionMethods => extensionMethods.GroupBy(extensionMethod => extensionMethod.Method));

            var easierFormat = grouped
                .Select(extendedClass => new ExtensionClass(extendedClass.First().First().Class,
                    extendedClass.Select(extensionMethod => new ExtensionMethod(extensionMethod.First().Method,
                        extensionMethod.Select(info => info.Namespace).Distinct().ToList())).Distinct().ToList()))
                .ToList()
                .OrderBy(extendedClass => extendedClass.Extends)
                .ToList();

            return easierFormat;
        }

        private static bool ClassCanHaveExtensionMethods(Type @class) =>
            @class.IsSealed && !@class.IsGenericType && !@class.IsNested;

        private static string ExtendedClassName(ExtensionMethodInfo info) => (info.Class).NoTilde();

        public static List<ExtensionMethodInfo> GetExtensionMethods(Assembly assembly)
        {
            var extendingClasses = assembly
                .GetExportedTypes()
                .Where(ClassCanHaveExtensionMethods);

            var extensionMethods = extendingClasses.SelectMany(
                extendingClass => extendingClass.GetExtensionMethods()
                    .Select(extendingMethod =>
                    {
                        var extendedClass = extendingMethod.GetExtendedClass().Namespace + "." +
                                            extendingMethod.GetExtendedClass().Name.NoTilde();

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