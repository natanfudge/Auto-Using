using System.Collections.Generic;
using System;
using System.Reflection;
using AutoUsing.Analysis.Cache;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;
using AutoUsing.Analysis;

namespace AutoUsingTest
{
    [TestClass]
    public class AssemblyLoadingTest
    {

        [TestMethod]
        public void LoadAssemblyTest()
        {
            var scans = typeof(GlobalCache).CallPrivateStaticMethod<IEnumerable<AssemblyScan>>("GetBaseAssemblyScans").ToList();
            Assert.IsTrue(scans.Count > 20, "A lot of dlls should be loaded from the .NET core libraries.");
        }
        //TODO: it seems  that extension methods are not working
    }
}