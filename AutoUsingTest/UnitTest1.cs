using System.Text;
using System.Reflection;
using System;
using System.IO;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using AutoUsing;

namespace AutoUsingTest
{
	[TestClass]
	public class UnitTest1
	{
		[TestMethod]
		public void TestMethod1()
		{
			var str = ReferenceScanner.GetAllReferences();
            
		}
	}
}
