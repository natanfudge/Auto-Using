using System.Threading;
using System.Threading.Tasks;
using System;
using System.Diagnostics;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace AutoUsingTest
{
    [TestClass]
    public class ServerTest
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
                    Arguments = "C:/Users/natan/Desktop/Auto-Using-Git/AutoUsingCs/AutoUsing/bin/Debug/netcoreapp2.1/AutoUsing.dll",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardInput = true,
                    RedirectStandardError = true,
                    WorkingDirectory = "C:/Users/natan/Desktop/Auto-Using-Git/AutoUsingCs/AutoUsing/bin/Debug/netcoreapp2.1/"
                }
            };
            

//            Server.OutputDataReceived += OutputDataReceived;
//            Server.ErrorDataReceived += ErrorDataReceived;
//            Server.Exited += Exited;

            Server.Start();
            ChildProcessTracker.AddProcess(Server);

            
            
            Log(Server.StandardOutput.ReadLine());
            
//            Server.BeginOutputReadLine();
//            Server.BeginErrorReadLine();

        }

        [AssemblyCleanup]
        public static void End()
        {
            Trace.Unindent();

//            if (Proccesing >= 0)
//            {
//                int timePassed = 0;
//                while (Proccesing > 0)
//                {
//                    Thread.Sleep(100);
//                    timePassed += 100;
//                    if (timePassed > 5000)
//                    {
//                        Log("The response is taking too long...");
//                        break;
//                    }
//                }
//            }
//            else
//            {
//                Log("Something is wrong with the proccesing");
//            }


//            Server.Close();
//            Server.Kill();

        }

        [TestMethod]
        public void Ping()
        {
            var pong = Request("{'Command':'ping',Arguments:''}");
            Assert.AreEqual("{\"Success\":true,\"Body\":\"pong\"}",pong);
        }

        [TestMethod]
        public void AddProjects()
        {
            //"{"Command":"addProjects","Arguments":{"projects":["Hello"]}}"
            var response = Request("{\"Command\":\"addProjects\",\"Arguments\":{\"projects\":[\"Hello\"]}}");
            Assert.AreEqual("{\"Success\":true,\"Body\":\"\"}",response);
        }



        private static string Request(string req)
        {
            Server.StandardInput.WriteLine(req);
            var response = Server.StandardOutput.ReadLine();
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