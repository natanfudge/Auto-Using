using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using AutoUsing.DataTypes;

namespace AutoUsing
{
    class Program
    {
        // static IOProxy Proxy = new IOProxy();
        // static AssemblyScanner Scanner { get; set; }
        // static List<Project> Projects = new List<Project>();

        static Server Server = new Server();

        static void Main(string[] args)
        {

            Console.WriteLine("Auto-Using server started.");

            // TODO: Error Handling.. 👌
            // I just wanna see this working, a very rough version. 
            // then i'll write tests, refactor the code.

            args = new[]
            {
                // "/Volumes/Workspace/csharp-extensions/Auto-Using/AutoUsing/AutoUsing.csproj",
                // "/Volumes/Workspace/csharp-extensions/Auto-Using/AutoUsingTest/AutoUsingTest.csproj"
               "C:/Users/natan/Desktop/Auto-Using-Git/AutoUsingCs/AutoUsing/AutoUsing.csproj"
            };


            if (args.Length <= 0)
            {
                Server.Error(Errors.AtLeastOneProjectFileIsRequired);
                return;
            }

            Server.AddCmdArgProjects(args);

            Server.Proxy.EditorDataReceived += (s, e) =>
            {
                /*
                    {"Command":"ping","arguments":""}
                    {"Command":"AddProjects","arguments":"C:/Users/natan/Desktop/Auto-Using-Git/AutoUsing/AutoUsing.csproj,
                    "C:/Users/natan/Desktop/Auto-Using-Git/AutoUsing/AutoUsingTest.csproj"}
                    ...
                */

                //TODO: turn that into:
                /*
                {"Name":"ping","arguments":{}}}
                {
                    "Name":"AddProjects",
                    "arguments":{
                        "Projects" : ["C:/Users/natan/Desktop/Auto-Using-Git/AutoUsing/AutoUsing.csproj",
                                      "C:/Users/natan/Desktop/Auto-Using-Git/AutoUsing/AutoUsingTest.csproj"],
                        "Color":"Orange"
                    }
                }

                etc...
                
                Then each function in Server.cs is declared like this:
                void Pong(PongRequest req){...}
                void AddProjects(AddProjectsRequest req){...}
                void RemoveProject(RemoveProjectRequest req){...}

                Then we can actually access 'req.arguments.color' as a typed object without having to 'guess' that the string 'req.arguments' actually means color.
                
                
                 */

                

                Request req;
                try
                {
                    req = e.Data;
                }
                catch (Exception ex)
                {
                    if(ex is JsonSerializationException || ex is JsonReaderException)
                    Server.Error(Errors.InvalidRequestFormat);
                    return;
                }


                switch (req.Command)
                {
                    case EndPoints.GetAllReferences:
                        Server.SendAllReferences(req.Specificly<GetAllReferencesRequest>());
                        break;
                    case EndPoints.AddProject:
                        Server.AddProject(req);
                        break;
                    case EndPoints.RemoveProject:
                        Server.RemoveProject(req);
                        break;
                    case EndPoints.Ping:
                        Server.Pong(req);
                        break;
                    case EndPoints.AddProjects:
                        Server.AddProjects(req.Specificly<AddProjectsRequest>());
                        break;

                    default:
                        Server.Error(Errors.UndefinedRequest);
                        break;
                }
            };

            Server.Listen();
        }
    }
}
