using System.Collections.Generic;
using System.Linq;
using AutoUsing.Analysis;
using AutoUsing.Analysis.Cache;
using AutoUsing.Analysis.DataTypes;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace AutoUsingTest
{
    [TestClass]
    public class AssemblyScanTest
    {
        private List<AssemblyScan> scans;

        const string NUnitDllLocation = "C:/Users/natan/.nuget/packages/nunit/3.11.0/lib/netstandard2.0/nunit.framework.dll";

        [TestInitialize]
        public void Setup()
        {
            scans = typeof(GlobalCache).CallPrivateStaticMethod<IEnumerable<AssemblyScan>>("GetBaseAssemblyScans").ToList();
            scans.Add(new AssemblyScan(NUnitDllLocation));
        }

        [TestMethod]
        public void TestGetTypeInfo()
        {
            var info = scans.SelectMany(scan => scan.GetTypeInfo()).ToList();
            var shouldNotContain = new TypeCompletionInfo("Console", "Internal");
            info.ShouldNotContain(shouldNotContain, "The generated completion types of the .NET types should not contain the internal" +
                                                   "Console.Internal class.");

            var shouldContain = new List<TypeCompletionInfo>
            {
                new TypeCompletionInfo("File","System.IO"),
                new TypeCompletionInfo("Console","System"),
                new TypeCompletionInfo("IEnumerable","System.Collections"),
            };
            foreach (var shouldContainItem in shouldContain)
            {
                info.ShouldContain(shouldContainItem, "The generated completion types of the .NET types should" +
                                                     "contain basic types.");
            }

            var shouldContainAttribute = new TypeCompletionInfo("Serializable", "System");
            info.ShouldContain(shouldContainAttribute, "Attribute classes should have their 'Attribute' prefix stripped off of them. ");
            var shouldContainAttributeLibrary = new TypeCompletionInfo("Test","NUnit.Framework");
            info.ShouldContain(shouldContainAttributeLibrary,
            "Attributes that don't directly extend Syste.Attribute should have the 'Attribute' prefix stripped off of them.");
        }
    }
}