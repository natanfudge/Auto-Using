using System;
using System.Collections.Generic;
using System.Linq;
using AutoUsing.Models;
using AutoUsing.Proxy;
using Newtonsoft.Json;

namespace AutoUsing
{
    public class Program
    {

        public static Server Server = new Server();

        public static void Main(string[] args)
        {

            // Console.WriteLine(" Best Auto-Using server started.");

            // TODO: Error Handling.. 👌
            // I just wanna see this working, a very rough version. 
            // then i'll write tests, refactor the code.

//            args = new[]
//            {
//                // "/Volumes/Workspace/csharp-extensions/Auto-Using/AutoUsing/AutoUsing.csproj",
//                // "/Volumes/Workspace/csharp-extensions/Auto-Using/AutoUsingTest/AutoUsingTest.csproj"
//               "C:/Users/natan/Desktop/Auto-Using-Git/AutoUsingCs/AutoUsing/AutoUsing.csproj"
//            };


            // if (args.Length <= 0)
            // {
            //     Server.WriteError(Errors.AtLeastOneProjectFileIsRequired);
            //     return;
            // }

            // Server.AddCmdArgProjects(args);

            Server.Proxy.EditorDataReceived += (s, e) =>
            {
         


                Request req;
                try
                {
                    req = e.Data;
                }
                catch (Exception ex)
                {
                    if (ex is JsonSerializationException || ex is JsonReaderException)
                        Server.WriteError(Errors.InvalidRequestFormat);
                    return;
                }

                if (req == null)
                {
                    Server.WriteError(Errors.InvalidRequestFormat);
                    return;
                }

                Response response = new Response();
                switch (req.Command)
                {
                    case EndPoints.GetAllReferences:
                        response = Server.GetAllReferences(req.Specificly<GetAllReferencesRequest>());
                        break;
                    case EndPoints.AddProject:
                        
                        /* response =*/
                        Server.AddProject(req);
                        break;
                    case EndPoints.RemoveProject:
                        
                        /* response = */
                        Server.RemoveProject(req);
                        break;
                    case EndPoints.Ping:
                        response = Server.Pong(req);
                        break;
                    case EndPoints.AddProjects:
                        response = Server.AddProjects(req.Specificly<AddProjectsRequest>());
                        break;

                    default:
                        response = Server.Error(Errors.UndefinedRequest);
                        break;
                }


                Server.Proxy.WriteData(response);


            };

            Server.Listen();
        }
        
    }
}
