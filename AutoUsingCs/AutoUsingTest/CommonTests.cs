using System;
using AutoUsing;
using AutoUsing.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System.Linq;
using System.Collections.Generic;
using AutoUsing.Analysis.DataTypes;
using AutoUsing.Proxy;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema;

// using 

namespace AutoUsingTest
{
    public class CommonTests
    {

        public string Location { get; set; }
        public string Name { get; set; }
        private Response AddProjects()
        {
            // var start = DateTime.Now;
            var request = new SetupWorkspaceRequest
            {
                Projects =  new List<string> {Location},
                WorkspaceStorageDir  = "C:\\Users\\natan\\Desktop\\Auto-Using-Git\\AutoUsingCs\\AutoUsingTest\\storagedir",
                ExtensionDir = "C:\\Users\\natan\\Desktop\\Auto-Using-Git\\.vscode"
            };
            var response = Program.Server.AddProjects(request);
            // start.LogTimePassed("AddProjects");
            return response;
        }

        public void Init()
        {
            var response = AddProjects();
            Assert.IsInstanceOfType(response, typeof(SuccessResponse));
        }


        public void GetAllBaseTypes()
        {
            var request = new GetCompletionDataRequest { ProjectName = Name, WordToComplete = "F" };
            var response = Program.Server.GetAllTypes(request) as GetAllTypesResponse;
            Assert.IsNotNull(response);
            var shouldContain = new AutoUsing.Analysis.DataTypes.TypeCompletion("File", new List<string> { "System.IO", "System.Net" });
            (response.Body as List<AutoUsing.Analysis.DataTypes.TypeCompletion>).AssertContains(shouldContain);
        }


        public void GetAllProjectTypes()
        {
            var request = new GetCompletionDataRequest { ProjectName = Name, WordToComplete = "J" };
            var response = Program.Server.GetAllTypes(request) as GetAllTypesResponse;
            Assert.IsNotNull(response);
            var shouldContain = new AutoUsing.Analysis.DataTypes.TypeCompletion("JsonConvert", new List<string> { "Newtonsoft.Json" });
            (response.Body as List<AutoUsing.Analysis.DataTypes.TypeCompletion>).AssertContains(shouldContain);

            var response2 = Program.Server.GetAllTypes(request) as GetAllTypesResponse;
            Assert.IsNotNull(response2);
            (response2.Body as List<AutoUsing.Analysis.DataTypes.TypeCompletion>).AssertContains(shouldContain);
        }
        public void GetAllBaseExtensions()
        {
            var request = new GetCompletionDataRequest { ProjectName = Name, WordToComplete = "RE" };
            var response = Program.Server.GetAllExtensionMethods(request) as GetAllExtensionMethodsResponse;
            Assert.IsNotNull(response);
            var shouldContain = new ExtensionClass("System.Collections.Generic.IDictionary",
                    new List<ExtensionMethod> {
                    new ExtensionMethod("Remove",new List<string>{"System.Collections.Generic"})
            });
            (response.Body as List<ExtensionClass>).AssertContains(shouldContain);


            var response2 = Program.Server.GetAllExtensionMethods(request) as GetAllExtensionMethodsResponse;
            Assert.IsNotNull(response2);
            (response2.Body as List<ExtensionClass>).AssertContains(shouldContain);
        }

        

        public void GetAllProjectExtensions()
        {
            var request = new GetCompletionDataRequest { ProjectName = Name, WordToComplete = "I" };
            var response = Program.Server.GetAllExtensionMethods(request) as GetAllExtensionMethodsResponse;
            Assert.IsNotNull(response);
            (response.Body as List<ExtensionClass>).AssertContains(new ExtensionClass("Newtonsoft.Json.Schema",
                    new List<ExtensionMethod> {
                    new ExtensionMethod("IsValid",new List<string>{"Newtonsoft.Json.Linq"})
            }));

        }
        public void GetAllBaseHiearchies()
        {
            var request = new ProjectSpecificRequest { ProjectName = Name };
            var response = Program.Server.GetAllHierarchies(request) as GetAllHierachiesResponse;
            var response2 = Program.Server.GetAllHierarchies(request) as GetAllHierachiesResponse;
            Assert.IsNotNull(response);
            Assert.AreEqual(response, response2);
        }

        public void GetAllProjectHiearchies()
        {
            var request = new ProjectSpecificRequest { ProjectName = Name };
            var response = Program.Server.GetAllHierarchies(request) as GetAllHierachiesResponse;
            var response2 = Program.Server.GetAllHierarchies(request) as GetAllHierachiesResponse;
            Assert.IsNotNull(response);
            Assert.AreEqual(response, response2);
        }




        public void GetAllProjectExtensionMethods()
        {
            //TODO
        }

        public void GetAllProjectHierachies()
        {
            //TODO
        }

    }
}