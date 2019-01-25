using System;
using AutoUsing;
using AutoUsing.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

namespace AutoUsingTest
{
    public class ServerTest
    {
        [TestMethod]
        public void AddProjects()
        {
        }

        [TestMethod]
        public void GetTypes()
        {
            AddProjects();
            Console.Out.
            var request = new GetAllReferencesRequest {projectName = "AutoUsing"}
        };

//            Program.Server.SendAllReferences(new GetAllReferencesRequest {projectName = "AutoUsing"});

//            var response = Request(request);
//            var expectedResponse = JsonConvert.DeserializeObject<GetAllReferencesResponse>(response);
//            Assert.AreEqual();
    }
}

}