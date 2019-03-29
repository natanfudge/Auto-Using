using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using AutoUsing;
using AutoUsing.Analysis;
using AutoUsing.Models;
using AutoUsing.Proxy;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace AutoUsingTest
{
    [TestClass]
    public class ProjectTest
    {
        private Response AddProjects()
        {
            // var start = DateTime.Now;
            // var request = new SetupWorkspaceRequest
            
            // (
            //     projects: new List<string>
            //         {"C:\\Users\\natan\\Desktop\\Auto-Using-Git\\AutoUsingCs\\AutoUsing\\AutoUsing.csproj"},
            //         workspaceStorageDir:""
            // );
            //TODO: specify arguments of request
            var request = new SetupWorkspaceRequest();
            var response = Program.Server.AddProjects(request);
            // start.LogTimePassed("AddProjects");
            return response;
        }

        [TestMethod]
        public void AddProjectsTest()
        {
            Program.Main(new[]{""});
            AddProjects();
        }

        [TestInitialize]
        public void Init()
        {
            //            var response = AddProjects();
            //            Assert.IsInstanceOfType(response, typeof(SuccessResponse));
        }

        const string dir = "C:\\Users\\natan\\Desktop\\Auto-Using-Git\\AutoUsingCs\\TestProg\\";
        string oldProj = $"{dir}TestProg.csproj";
        string newProj = $"{dir}Amar.csproj";

        [TestMethod]
        //TODO: filewatcher event is not being triggered when moving using Move()... Need to figure out how to test this
        public void ProjectNameChanged()
        {
            Program.Main(new[] { oldProj });
            File.Move(oldProj, newProj);
            var serverProjects = TestUtil.GetPrivateField<List<Project>>(Program.Server, "Projects");
            Assert.AreEqual("Amar.csproj", serverProjects[0].FileName);
        }

        [TestCleanup]
        public void CleanUp()
        {
            if (File.Exists(newProj))
            {
                File.Move(newProj, oldProj);
            }
        }
    }
}