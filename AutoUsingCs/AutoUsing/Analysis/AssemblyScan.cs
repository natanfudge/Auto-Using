using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using AutoUsing.Analysis.DataTypes;

namespace AutoUsing.Analysis
{
    public class AssemblyScan
    {

        /// <summary>
        /// Loads assembly from path 
        /// </summary>
        public AssemblyScan(string path)
        {
            this.Path = path.ParseEnvironmentVariables();
            try
            {
                Assembly = Assembly.LoadFile(this.Path);
            }
            catch (Exception e)
            {
                if (e is BadImageFormatException || e is FileLoadException) Assembly = null;
            }
        }

        /// <summary>
        /// Does not load an assembly but rather takes in an already loaded assembly so data could be extracted from it.
        /// </summary>
        public AssemblyScan(Assembly assembly)
        {
            Assembly = assembly;
        }



        private Assembly Assembly { get; set; }

        public string Path { get; set; }

        /// <summary>
        /// Returns true if loading the assembly threw an exception so that assembly cannot be parsed
        /// </summary>
        public bool CouldNotLoad() => Assembly == null;


        public List<TypeCompletionInfo> GetTypeInfo()
        {
            var references = Assembly.GetExportedTypes()
                .Select(type => new TypeCompletionInfo(type.Name.NoTilde(), type.Namespace))
                .ToList();

            return references;
        }

        public List<HierarchyInfo> GetHierarchyInfo()
        {
            return Assembly.GetExportedTypes()
                            .Select(type =>
                            {
                                if (type.IsStatic()) return null;

                                var fathers = type
                                    // Add in the interfaces of the class
                                    .GetInterfaces()
                                    .Select(@interface => @interface.Namespace + "." + @interface.Name.NoTilde())
                                    // Add in the baseclass of the class
                                    .Append(GetBaseClassAsString(type))
                                    .ToList();
                                var name = type.Name.NoTilde();

                                if (type.IsGenericType) name += "<>";

                                AddRuntimeOnlyHierarchies(fathers, type);


                                return new HierarchyInfo(name, type.Namespace, fathers);
                            })
                            .Where(info => info != null).ToList();


        }

        /// <summary>
        /// Most types have their baseclasses defined at runtime. HOWEVER. The fact that arrays implement IEnumerable and such is a runtime-only thing and 
        /// we need to add it in manually.
        /// </summary>
        private void AddRuntimeOnlyHierarchies(List<string> hierarchies, Type type)
        {
            if (type.Name.NoTilde().Equals("Array") && type.Namespace.Equals("System"))
            {
                hierarchies.AddRange(ArrayRuntimeImplementations);
            }
        }

        readonly List<string> ArrayRuntimeImplementations = new List<string>
        {
            "System.Collections.Generic.IList", "System.Collections.Generic.ICollection",
            "System.Collections.Generic.IEnumerable"
        };

        private string GetBaseClassAsString(Type type)
        {
            var baseClass = type.BaseType;
            if (baseClass == null) return "System.Object";
            else return baseClass.Namespace + "." + baseClass.Name.NoTilde();
        }

        public List<ExtensionMethodInfo> GetExtensionMethodInfo()
        {
            var extendingClasses = Assembly
                .GetExportedTypes()
                .Where(ClassCanHaveExtensionMethods);

            var extensionMethods = extendingClasses.SelectMany(
                extendingClass => extendingClass.GetExtensionMethods()
                    .Select(extendingMethod =>
                    {
                        var extendedClassName = extendingMethod.GetExtendedClass().Namespace + "." + extendingMethod.GetExtendedClass().Name.NoTilde();

                        return new ExtensionMethodInfo(
                            extendingClass.Namespace,
                            extendingMethod.Name,
                            extendedClassName
                        );
                    })).ToList();

            return extensionMethods;
        }

        private static bool ClassCanHaveExtensionMethods(System.Type @class) => @class.IsSealed && !@class.IsGenericType && !@class.IsNested;


    }
}