using System.IO;
using System.Diagnostics;
using System;
using System.Collections.Generic;
using System.Linq;
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
        private static Task<ILanguageServer> CreateLanguageServer()
        {
            return LanguageServer.From(options =>
                    options
                        .WithInput(Console.OpenStandardInput())
                        .WithOutput(Console.OpenStandardOutput())
                        .WithLoggerFactory(new LoggerFactory())
                        .AddDefaultLoggingProvider()
                        .WithMinimumLogLevel(LogLevel.Trace)
                        .WithHandler<CompletionProvider>()
                        .WithHandler<TextDocumentHandler>()
                     );
        }
        
        

        private const string SetupWorkspace = "setupWorkspace";

        //TODO: Nunit.Framework.Test does not appear in the completions!
        //TODO: Support attributes and mark it in changelog!
        //TODO: Make it so only attributes appear between []. Low priority. 
        //TODO: Have a task that debugs the server and runs the extension without extra clicking
        //TODO: omnisharp is going insane about Unable to find workspace/didChangeConfiguration, methods found include 
        //TODO: Using a document selector without a scheme. Bah!
        //TODO: call activate takes a century. 
        
        public static async Task Main(string[] args)
        {
            if (args.Length == 0) throw new ServerException("A workspace setup json must be provided.");
            Server.Instance.SetupWorkspace(JSON.Parse<SetupWorkspaceRequest>(args[0]));
            var server = await CreateLanguageServer();
            
            // Console

            await server.WaitForExit;
            
        }

        


    }
}