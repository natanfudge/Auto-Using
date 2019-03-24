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
    public class ServerTest
    {
        private Response AddProjects()
        {
            var start = DateTime.Now;
            var request = new AddProjectsRequest
            {
                Projects = new List<string>
                    {"C:\\Users\\natan\\Desktop\\Auto-Using-Git\\AutoUsingCs\\AutoUsing\\AutoUsing.csproj"}
            };
            var response = Program.Server.AddProjects(request);
            start.LogTimePassed("AddProjects");
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
            var request = new GetCompletionDataRequest { ProjectName = "AutoUsing", WordToComplete = "F" };
            var response = Program.Server.GetAllReferences(request) as GetAllReferencesResponse;
            Assert.IsNotNull(response);
            (response.Body as List<Reference>).AssertContains(new Reference("File", new List<string> { "System.IO", "System.Net" }));
        }


        [TestMethod]
        public void GetAllProjectReferences()
        {
            var request = new GetCompletionDataRequest { ProjectName = "AutoUsing", WordToComplete = "J" };
            var response = Program.Server.GetAllReferences(request) as GetAllReferencesResponse;
            Assert.IsNotNull(response);
            (response.Body as List<Reference>).AssertContains(new Reference("JsonConvert", new List<string> { "Newtonsoft.Json" }));
        }
        [TestMethod]
        public void GetAllProjectExtensions()
        {
            var request = new GetCompletionDataRequest { ProjectName = "AutoUsing", WordToComplete = "R" };
            var response = Program.Server.GetAllExtensionMethods(request) as GetAllExtensionMethodsResponse;
            Assert.IsNotNull(response);
            (response.Body as List<ExtensionClass>).AssertContains(new ExtensionClass("System.Collections.Generic.IDictionary",
                    new List<ExtensionMethod> {
                    new ExtensionMethod("Remove",new List<string>{"System.Collections.Generic"})
            }));
        }
        [TestMethod]
        public void GetAllProjectHiearchies()
        {
            var request = new ProjectSpecificRequest { ProjectName = "AutoUsing" };
            var response = Program.Server.GetAllHiearchies(request) as GetAllHierachiesResponse;
            Assert.IsNotNull(response);
            // (response.Body as List<Reference>).AssertContains(new Reference("JsonConvert", new List<string> { "Newtonsoft.Json" }));
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