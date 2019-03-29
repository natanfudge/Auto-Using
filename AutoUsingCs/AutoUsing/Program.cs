using System.Diagnostics;
using System;
using System.Collections.Generic;
using System.Linq;
using AutoUsing.Models;
using AutoUsing.Proxy;
using Newtonsoft.Json;
using AutoUsing.Utils;

namespace AutoUsing
{
    public class Program
    {
        public static Server Server = new Server();

        // private static int sentCounter
        public static void Main(string[] args)
        {

            // var test = "{\"command\":\"setupWorkspace\",\"arguments\":{\"projects\":[\"c:\\Users\\natan\\Desktop\\Auto-Using\\AutoUsing\\AutoUsing.csproj\"]}}";
            // JSON.Parse<GetCompletionDataRequest>(test);

            // {"command":"addProjects","arguments":{"projects":["c:\\Users\\natan\\Desktop\\Auto-Using\\AutoUsing\\AutoUsing.csproj"]}}
            // Server.AddCmdArgProjects(args);

            Server.Proxy.EditorDataReceived += (s, e) =>
            {
                // var watch = Stopwatch.StartNew();
                Request req;
                try
                {
                    req = e.Data;
                    // Util.LogTimePassed(watch,"parse request");
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


                var response = new Response();
                switch (req.Command)
                {
                    //TODO: convert specificly to cast
                    case EndPoints.GetAllTypes:
                        response = Server.GetAllTypes(req.Specificly<GetCompletionDataRequest>());
                        break;
                    case EndPoints.getAllExtensions:
                        response = Server.GetAllExtensionMethods(req.Specificly<GetCompletionDataRequest>());
                        break;
                    case EndPoints.getAllHiearchies:
                        response = Server.GetAllHierarchies(req.Specificly<ProjectSpecificRequest>());
                        break;
                    case EndPoints.Ping:
                        response = Server.Pong(req);
                        break;
                    case EndPoints.SetupWorkspace:
                        response = Server.AddProjects(req.Specificly<SetupWorkspaceRequest>());
                        break;

                    default:
                        response = Server.Error($"{Errors.UndefinedRequest} '{req.Command}'");
                        break;
                }

                // Util.Log("Sending response!");
                Server.Proxy.WriteData(response);

                // Util.
        

                // Util.LogTimePassed(watch, req.Command);
            };

            Server.Listen();
        }
    }
}