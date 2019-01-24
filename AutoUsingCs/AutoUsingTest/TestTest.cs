using System.Threading;
using System.Threading.Tasks;
using System;
using System.Diagnostics;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace AutoUsingTest
{
    [TestClass]
    public class TestTest
    {

        private Process Server;
        private int Proccesing = 1;

        [TestInitialize]
        public void Init()
        {
            Trace.Listeners.Add(new TextWriterTraceListener(Console.Out));
            Trace.AutoFlush = true;
            Trace.Indent();


            Server = new Process
            {
                EnableRaisingEvents = true,

                StartInfo = new ProcessStartInfo
                {
                    FileName = "dotnet",
                    Arguments = "C:/Users/natan/Desktop/Auto-Using-Git/AutoUsingCs/TestProg/bin/Debug/netcoreapp2.1/TestProg.dll",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardInput = true,
                    RedirectStandardError = true,
                    WorkingDirectory = "C:/Users/natan/Desktop/Auto-Using-Git/AutoUsingCs/TestProg/bin/Debug/netcoreapp2.1/"
                }
            };

            Server.OutputDataReceived += new System.Diagnostics.DataReceivedEventHandler(process_OutputDataReceived);
            Server.ErrorDataReceived += new System.Diagnostics.DataReceivedEventHandler(process_ErrorDataReceived);
            Server.Exited += new System.EventHandler(process_Exited);

            Server.Start();
            Server.BeginOutputReadLine();
            Server.BeginErrorReadLine();
        }

        [TestCleanup]
        public void End()
        {
            Trace.Unindent();

            if (Proccesing >= 0)
            {
                int timePassed = 0;
                while (Proccesing > 0)
                {
                    Thread.Sleep(100);
                    timePassed += 100;
                    if (timePassed > 5000)
                    {
                        Trace.WriteLine("The response is taking too long...");
                        break;
                    }
                }
            }
            else
            {
                Trace.WriteLine("Something is wrong with the proccesing");
            }


            Server.Close();
            Server.Kill();
        }

        [TestMethod]
        public void amar()
        {
            Request("food");
            Request("Banana");
            Request("Lemon");
        }



        public void Request(string req)
        {
            Server.StandardInput.WriteLine(req);
            Proccesing++;
        }


        void process_Exited(object sender, EventArgs e)
        {
            Trace.WriteLine(string.Format("process exited with code {0}", Server.ExitCode.ToString()));

        }

        void process_ErrorDataReceived(object sender, DataReceivedEventArgs e)
        {
            Trace.WriteLine(e.Data);
            if (e.Data != null) Proccesing--;
        }

        void process_OutputDataReceived(object sender, DataReceivedEventArgs e)
        {
            Trace.WriteLine(e.Data);
            Proccesing--;
        }

    }
}