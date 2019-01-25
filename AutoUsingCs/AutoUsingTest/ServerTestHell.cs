using System.Threading;
using System.Threading.Tasks;
using System;
using System.Diagnostics;
using AutoUsing;
using AutoUsing.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

namespace AutoUsingTest
{
    [TestClass]
    public class ServerTestHell
    {
        private static Process Server;
        private static int Proccesing = 1;

        [TestInitialize]
        public void Init()
        {
            Trace.Listeners.Add(new TextWriterTraceListener(Console.Out));
            Trace.AutoFlush = true;
            Trace.Indent();


            Server = new Process
            {
//                EnableRaisingEvents = true,

                StartInfo = new ProcessStartInfo
                {
                    FileName = "dotnet",
                    Arguments =
                        "C:/Users/natan/Desktop/Auto-Using-Git/AutoUsingCs/AutoUsing/bin/Debug/netcoreapp2.1/AutoUsing.dll",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardInput = true,
                    RedirectStandardError = true,
                    WorkingDirectory =
                        "C:/Users/natan/Desktop/Auto-Using-Git/AutoUsingCs/AutoUsing/bin/Debug/netcoreapp2.1/"
                }
            };

            Server.Start();
            ChildProcessTracker.AddProcess(Server);


            Log(Server.StandardOutput.ReadLine());
        }


        [TestMethod]
        public void Ping()
        {
            var pong = Request("{'Command':'ping',Arguments:''}");
            Assert.AreEqual("{\"Success\":true,\"Body\":\"pong\"}", pong);
        }

        [TestMethod]
        public void AddProjectsError()
        {
            var response = Request("{\"Command\":\"addProjects\",\"Arguments\":{\"projects\":[\"Hello\"]}}");
            Assert.AreEqual("{\"Success\":false,\"Body\":\"No project exists at the path\"}", response);
        }

        [TestMethod]
        public void AddProjects()
        {
            var response =
                Request(
                    @"{""Command"":""addProjects"",""Arguments"":{""projects"":[""C:/Users/natan/Desktop/Auto-Using-Git/AutoUsingCs/AutoUsing/AutoUsing.csproj""]}}");
            Assert.AreEqual("{\"Success\":true,\"Body\":null}", response);
        }

//        [TestMethod]
//        public void GetTypes()
//        {
//            AddProjects();
//            var request = new Request
//                {Command = "getAllReferences", Arguments = new GetAllReferencesRequest {projectName = "AutoUsing"}};
//            
////            Program.Server.SendAllReferences(new GetAllReferencesRequest {projectName = "AutoUsing"});
//                
//            var response = Request(request);
//            var expectedResponse = JsonConvert.DeserializeObject<GetAllReferencesResponse>(response);
////            Assert.AreEqual();
//        }


        private static string Request(string req)
        {
            Server.StandardInput.WriteLine(req);
//            await Task.Delay(1000);
            var response = Server.StandardOutput.ReadLine();
//            while (response !=null)
//            {
//                response = Server.StandardOutput.ReadLine();
//            }
//            if (response == null)
//            {
//                throw new Exception("Server did not respond!");
//            }
            Log("Received response: " + response);
            return response;
        }


        private void Exited(object sender, EventArgs e)
        {
            Log(string.Format("process exited with code {0}", Server.ExitCode.ToString()));
        }

        private void ErrorDataReceived(object sender, DataReceivedEventArgs e)
        {
            Log(e.Data);
            if (e.Data != null) Proccesing--;
        }

        private void OutputDataReceived(object sender, DataReceivedEventArgs e)
        {
            Log(e.Data);
            Proccesing--;
        }

        private static void Log(string str)
        {
            Console.WriteLine(str);
//            Trace.WriteLine(str);
        }
    }
}