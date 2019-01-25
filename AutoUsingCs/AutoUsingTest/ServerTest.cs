using System;
using AutoUsing;
using AutoUsing.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System.Linq;
using System.Collections.Generic;
using AutoUsing.Analysis.DataTypes;

// using 

namespace AutoUsingTest
{
    [TestClass]
    public class ServerTest
    {
        private Response AddProjects()
        {
            var request = new AddProjectsRequest
            {
                Projects = new List<string>
                    {"C:\\Users\\natan\\Desktop\\Auto-Using-Git\\AutoUsingCs\\AutoUsing\\AutoUsing.csproj"}
            };
            var response = Program.Server.AddProjects(request);
            return response;
        }

        [TestInitialize]
        public void Init()
        {
            var response = AddProjects();
            Assert.IsInstanceOfType(response, typeof(SuccessResponse));
        }


        [TestMethod]
        public void GetAllBaseReferences()
        {
            var request = new GetAllReferencesRequest {ProjectName = "AutoUsing", WordToComplete = "F"};
            var response = Program.Server.GetAllReferences(request) as GetAllReferencesResponse;
            Assert.IsNotNull(response);
            response.References.AssertContains(new Reference("File", new List<string> {"System.IO", "System.Net"}));
        }
        
        
        [TestMethod]
        public void GetAllProjectReferences()
        {
            var request = new GetAllReferencesRequest {ProjectName = "AutoUsing", WordToComplete = "J"};
            var response = Program.Server.GetAllReferences(request) as GetAllReferencesResponse;
            Assert.IsNotNull(response);
            response.References.AssertContains(new Reference("JsonConvert", new List<string> {"Newtonsoft.Json"}));
        }

        [TestMethod]
        public void GetAllBaseExtensionMethods()
        {
            Assert.AreEqual(1,1);
            //TODO
        }

        [TestMethod]
        public void GetAllBaseHierachies()
        {
            //TODO
        }
        
        [TestMethod]
        public void GetAllProjectExtensionMethods()
        {
            //TODO
        }

        [TestMethod]
        public void GetAllProjectHierachies()
        {
            //TODO
        }

    }
}