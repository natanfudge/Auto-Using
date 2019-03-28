using System;
using AutoUsing;
using AutoUsing.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System.Linq;
using System.Collections.Generic;
using AutoUsing.Analysis.DataTypes;
using AutoUsing.Proxy;

// using 

namespace AutoUsingTest
{
    [TestClass]
    public class VscodePlaygroundTests
    {

        private CommonTests Tests = new CommonTests
        { Location = "C:\\Users\\natan\\Desktop\\Auto-Using-Git\\src\\test\\playground\\amar.csproj", Name = "amar" };

        [TestInitialize]
        public void Init()
        {
            Tests.Init();
        }


        [TestMethod]
        public void GetAllBaseReferences()
        {
            Tests.GetAllBaseReferences();
        }

        [TestMethod]
        public void GetAllProjectReferences()
        {
            Tests.GetAllProjectReferences();
        }

        [TestMethod]
        public void GetAllBaseExtensions()
        {
            Tests.GetAllBaseExtensions();
        }

        [TestMethod]
        public void GetAllProjectExtensionMethods()
        {
            Tests.GetAllProjectExtensionMethods();
        }

        [TestMethod]

        public void GetAllBaseHiearchies()
        {
            Tests.GetAllBaseHiearchies();
        }

        [TestMethod]
        public void GetAllProjectHierachies()
        {
            Tests.GetAllProjectHierachies();
        }

    }
}