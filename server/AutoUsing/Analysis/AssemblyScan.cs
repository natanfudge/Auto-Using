using System.Reflection.Metadata;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using AutoUsing.Analysis.DataTypes;
using AutoUsing.Utils;

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
        /// <summary>
        /// Extracts type information from the loaded assembly
        /// </summary>
        public List<TypeCompletionInfo> GetTypeInfo()
        {
            var types = Assembly.GetExportedTypes()
                .Where(IsNotInternalType)
                .Select(ConvertToTypeInfo)
                .ToList();

            return types;
        }

        /// <summary>
        /// Converts a .NET Type object into a TypeCompletionInfo object that is used by Auto-Using to produce completion items.
        /// </summary>
        private static TypeCompletionInfo ConvertToTypeInfo(Type type)
        {
            var name = type.Name.NoTilde();
            // If an attribute has a 'Attribute' suffix, then it is also valid to use it without the 'Attribute' suffix.
            // Essentially all people omit the 'Attribute' suffix, so we omit it aswell.
            // Example from NUnit: [TestAttribute] becomes [Test].
            if (type.IsAttribute() && name.EndsWith(AttributeSuffix))
            {
                name = name.Remove(name.Length - AttributeSuffix.Length);
            }
            //TODO: the bug is probably that attribute is not the direct base class
            return new TypeCompletionInfo(name, type.Namespace);
        }

        private const string AttributeSuffix = "Attribute";

        // private static bool IsAttri

        /// <summary>
        /// This is a calculated guess at measuring whether or not a class is internal and should never be imported. 
        /// </summary>
        private static bool IsNotInternalType(Type type)
        {
            return !type.Namespace.Contains("Internal");
        }

        /// <summary>
        /// Extracts hierarchy information from the loaded assembly
        /// </summary>
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

        /// <summary>
        /// Extracts extension method information from the loaded assembly
        /// </summary>
        public List<ExtensionMethodInfo> GetExtensionMethodInfo()
        {
            // Assembly.
            // Get all classes that declared an extension method inside them
            var extendingClasses = Assembly
                .GetExportedTypes()
                .Where(ClassCanHaveExtensionMethods);

            var extensionMethods = extendingClasses.SelectMany(
                extendingClass => extendingClass.GetExtensionMethods()
                    .Select(extendingMethod =>
                    {
                        var extendedClassName = extendingMethod.GetExtendedClass().Namespace + "." +
                                                extendingMethod.GetExtendedClass().Name.NoTilde();

                        return new ExtensionMethodInfo(
                            extendingClass.Namespace,
                            extendingMethod.Name,
                            extendedClassName
                        );
                    })).ToList();

            return extensionMethods;
        }

        private static bool ClassCanHaveExtensionMethods(System.Type @class) =>
            @class.IsSealed && !@class.IsGenericType && !@class.IsNested;
    }
}