using System;
using System.Collections.Generic;
using System.Linq;

namespace AutoUsing
{
    class Program
    {
        static IOProxy Proxy = new IOProxy();
        static AssemblyScanner Scanner { get; set; }
        static List<Project> Projects = new List<Project>();

        static void Main(string[] args)
        {
            // TODO: Error Handling.. 👌
            // I just wanna see this working, a very rough version. 
            // then i'll write tests, refactor the code.

            args = new[]
            {
                // "/Volumes/Workspace/csharp-extensions/Auto-Using/AutoUsing/AutoUsing.csproj",
                // "/Volumes/Workspace/csharp-extensions/Auto-Using/AutoUsingTest/AutoUsingTest.csproj"
               "C:/Users/natan/Desktop/Auto-Using-Git/AutoUsing/AutoUsing.csproj"
            };


            if (args.Length <= 0)
            {
                Proxy.WriteData(new ErrorResponse { Body = Errors.AtLeastOneProjectFileIsRequired });
                return;
            }

            foreach (var path in args)
            {
                Projects.Add(new Project(path, watch: true));
            }

            Proxy.EditorDataReceived += (s, e) =>
            {
                /*
                    {"Command":"ping","Arguments":""}
                    ...
                */
                Request req = e.Data;

                switch (req.Command)
                {
                    case EndPoints.GetAllCompletions:
                        {
                            var projectName = req.Arguments;

                            if (projectName.IsNullOrEmpty())
                            {
                                Proxy.WriteData(new ErrorResponse { Body = Errors.ProjectNameIsRequired });
                                break;
                            }

                            // Using C# 7.2 `is expression` to check for null, and assign variable
                            if (Projects.Find(o => o.Name == projectName) is Project project)
                            {
                                // ? Wanna determine whether we scan assemblies on the fly
                                // ? or do the scan as part of the project initialization above.
                                // ? and have a specific command to issue a rescan.

                                /* Psuedo-code
                                    foreach (var reference in project.References)
                                    {
                                        * We have these data...

                                        reference.Name; 
                                        reference.Version;
                                        reference.Path;

                                        * Can do something like this...

                                        Scanner = new AssemblyScanner();
                                        Scanner.LoadAssembly(reference.Path);
                                        Scanner.GetAllTypes();
                                    }
                                */

                                break;
                            }

                            Proxy.WriteData(new ErrorResponse { Body = Errors.SpecifiedProjectWasNotFound });
                        }
                        break;
                    case EndPoints.AddProject:
                        {
                            var projectFilePath = req.Arguments;

                            if (!projectFilePath.IsNullOrEmpty())
                            {
                                Projects.Add(new Project(projectFilePath, watch: true));

                                break;
                            }

                            Proxy.WriteData(new ErrorResponse { Body = Errors.ProjectFilePathIsRequired });
                        }
                        break;
                    case EndPoints.RemoveProject:
                        {
                            var projectName = req.Arguments;

                            if (!projectName.IsNullOrEmpty())
                            {
                                // One line torture :D
                                foreach (var project in Projects.Select(o => { if (o.Name != projectName) return null; o.Dispose(); return o; }))
                                {
                                    Projects.Remove(project);
                                }

                                break;
                            }

                            Proxy.WriteData(new ErrorResponse { Body = Errors.ProjectNameIsRequired });
                        }
                        break;
                    case EndPoints.Ping:
                        Proxy.WriteData(new SuccessResponse { Body = "pong" });
                        break;
                }
            };

            while (true)
            {
                Proxy.ReadData(new MessageEventArgs { Data = Console.ReadLine() });
            }
        }
    }
}
