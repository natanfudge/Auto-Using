// using System.Collections.Generic;
// using System.Linq;
// using AutoUsing.Analysis;
// using AutoUsing.Analysis.Cache;
// using AutoUsing.Analysis.DataTypes;
// using Microsoft.VisualStudio.TestTools.UnitTesting;

// namespace AutoUsingTest
// {
//     [TestClass]
//     public class ProjectAssemblyScanTest
//     {
//         private List<AssemblyScan> scans;
//         private Project project;

//         private const string DummyProjPath = "C:/Users/natan/Desktop/Auto-Using-Git/server/TestProg/TestProg.csproj";
//         private const string DummyStoragePath = "C:/Users/natan/Desktop/Auto-Using-Git/server/TestProg/cachestoragedir";

//         [TestInitialize]
//         public void Setup()
//         {
//             scans = typeof(GlobalCache).CallPrivateStaticMethod<IEnumerable<AssemblyScan>>("GetBaseAssemblyScans").ToList();
//             project = new Project(DummyProjPath,)
//         }
        
//         [TestMethod]
//         public void TestGetTypeInfo()
//         {
//             var info = scans.SelectMany(scan => scan.GetTypeInfo()).ToList();
//             var shouldNotContain = new TypeCompletionInfo("Console", "Internal");
//             info.ShouldNotContain(shouldNotContain,"The generated completion types of the .NET types should not contain the internal" +
//                                                    "Console.Internal class.");
            
//             var shouldContain = new List<TypeCompletionInfo>
//             {
//                 new TypeCompletionInfo("File","System.IO"),
//                 new TypeCompletionInfo("Console","System"),
//                 new TypeCompletionInfo("IEnumerable","System.Collections"),
//             };
//             foreach (var shouldContainItem in shouldContain)
//             {
//                 info.ShouldContain(shouldContainItem,"The generated completion types of the .NET types should" +
//                                                      "contain basic types.");
//             }

//             var shouldContainAttribute = new TypeCompletionInfo("Serializable","System");
//             info.ShouldContain(shouldContainAttribute,"Attribute classes should have their 'Attribute' prefix stripped off of them. ");
//         }
//     }
// }