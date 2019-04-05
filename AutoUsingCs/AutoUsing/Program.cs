using System.Diagnostics;
using System;
using System.Collections.Generic;
using System.Linq;
using AutoUsing.Models;
using AutoUsing.Proxy;
using Newtonsoft.Json;
using AutoUsing.Utils;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;
using OmniSharp.Extensions.LanguageServer.Server;
using AutoUsing.Lsp;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using OmniSharp.Extensions.JsonRpc;
using OmniSharp.Extensions.Embedded.MediatR;
using System.Threading;

namespace AutoUsing
{
    public class Program
    {
        // public static Server Server = new Server();
        //TODO: the using statement inserted by the server doesn't work well
        private static Task<ILanguageServer> CreateLanguageServer()
        {
            return LanguageServer.From(options =>
                    options
                        .WithInput(Console.OpenStandardInput())
                        .WithOutput(Console.OpenStandardOutput())
                        .WithLoggerFactory(new LoggerFactory())
                        .AddDefaultLoggingProvider()
                        .WithMinimumLogLevel(LogLevel.Trace)
                        // .WithServices(ConfigureServices)
                        .WithHandler<CompletionProvider>()
                        .WithHandler<TextDocumentHandler>()
                     // .WithHandler<WorkspaceSetupHandler>()
                     );
        }

        // private static void ConfigureServices(IServiceCollection services)
        // {
        //     services.AddSingleton<FileManager>();
        // }

        private const string SetupWorkspace = "setupWorkspace";

        //TODO: have a task that compiles both the server and client and runs extension
        //TODO: Have a task that debugs the server and runs the extension without extra clicking
        //TODO: omnisharp is going insane about Unable to find workspace/didChangeConfiguration, methods found include 
        //TODO: Using a document selector without a scheme. Bah!
        public static async Task Main(string[] args)
        {
            if (args.Length == 0) throw new ServerException("A workspace setup json must be provided.");
            Server.Instance.SetupWorkspace(JSON.Parse<SetupWorkspaceRequest>(args[0]));
            var server = await CreateLanguageServer();
            // var x = server.Workspace;
            // server.AddHandler(SetupWorkspace, new WorkspaceSetupHandler());

            // Util.Log("Parameter: " + args[0]);

            // Stopwatch watch = Stopwatch.StartNew();
            // var response = await server.SendRequest<test, string>("custom/data", new test("asdf"));
            // Util.Log("Got response: " + response + "time = " + watch.ElapsedMilliseconds);
            //   server.SendNotification<test>("custom/data", new test("asdf"));

            // server.Client.SendRequest()
            await server.WaitForExit;



            // Server.Proxy.EditorDataReceived += (s, e) =>
            // {
            //     string req = e.Data;
            //     Util.Log("Got request: " + req);
            //     Request requestObject;
            //     try
            //     {
            //         requestObject = JSON.Parse<Request>(e.Data);
            //     }
            //     catch (Exception ex)
            //     {
            //         if (ex is JsonSerializationException || ex is JsonReaderException)
            //             Server.WriteError(Errors.InvalidRequestFormat);
            //         return;
            //     }

            //     if (req == null)
            //     {
            //         Server.WriteError(Errors.InvalidRequestFormat);
            //         return;
            //     }

            //     var args = requestObject.Arguments as JToken;



            //     var response = new Response();
            //     switch (requestObject.Command)
            //     {
            //         case EndPoints.GetAllTypes:
            //             response = Server.GetAllTypes(args.ToObject<GetCompletionDataRequest>());
            //             break;
            //         case EndPoints.getAllExtensions:
            //             response = Server.GetAllExtensionMethods(args.ToObject<GetCompletionDataRequest>());
            //             break;
            //         case EndPoints.getAllHiearchies:
            //             response = Server.GetAllHierarchies(args.ToObject<ProjectSpecificRequest>());
            //             break;
            //         case EndPoints.Ping:
            //             response = Server.Pong(requestObject);
            //             break;
            //         case EndPoints.SetupWorkspace:
            //             response = Server.SetupWorkspace(args.ToObject<SetupWorkspaceRequest>());
            //             break;

            //         default:
            //             response = Server.Error($"{Errors.UndefinedRequest} '{requestObject.Command}'");
            //             break;
            //     }

            //     Server.Proxy.WriteData(response);

            // };

            // Server.Listen();
        }

        private static T ParseRequest<T>(string req)
        {
            return JSON.Parse<T>(req);
        }
    }
}