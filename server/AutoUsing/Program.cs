using System;
using AutoUsing.Utils;
using System.Threading.Tasks;
using OmniSharp.Extensions.LanguageServer.Server;
using AutoUsing.Lsp;
using Microsoft.Extensions.Logging;

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


        public static async Task Main(string[] args)
        {
            if (args.Length == 0) throw new ServerException("A workspace setup json must be provided.");
            Server.Instance.SetupWorkspace(JSON.Parse<SetupWorkspaceRequest>(args[0]));
            var server = await CreateLanguageServer();

            await server.WaitForExit;

        }


        //TODO: omnisharp is going insane about Unable to find workspace/didChangeConfiguration, methods found include 
        //TODO: Using a document selector without a scheme. Bah!
        //TODO: Make it so only attributes appear between []. Low priority. 


    }
}