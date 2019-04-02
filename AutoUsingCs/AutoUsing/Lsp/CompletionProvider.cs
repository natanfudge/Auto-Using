
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using OmniSharp.Extensions.LanguageServer.Protocol.Client.Capabilities;
using OmniSharp.Extensions.LanguageServer.Protocol.Models;
using OmniSharp.Extensions.LanguageServer.Protocol.Server;

namespace AutoUsing.Lsp
{
    class CompletionProvider : ICompletionHandler
    {
        private CompletionCapability _capability;
        private static Server server = new Server();
        private readonly ILanguageServer _router;
        // private readonly FileManager _bufferManager;
        private readonly DocumentSelector _documentSelector = new DocumentSelector(
                new DocumentFilter()
                {
                    Pattern = "**/*.cs"
                }
            );
        const int maxCompletionAmount = 100;

        public CompletionRegistrationOptions GetRegistrationOptions()
        {
            return new CompletionRegistrationOptions
            {
                DocumentSelector = _documentSelector,
                ResolveProvider = false
            };


        }

        // public CompletionProvider(ILanguageServer router, FileManager bufferManager)
        // {
        //     _router = router;
        //     _bufferManager = bufferManager;
        // }

        public async Task<CompletionList> Handle(CompletionParams request, CancellationToken cancellationToken)
        {
            // return new CompletionList(new CompletionItem{Label ="new version op"});
            // var result = await CompletionInstance.ProvideCompletionItems(request, server, _bufferManager);
             var result = await CompletionInstance.ProvideCompletionItems(request, server);
            return result;
        }

        public void SetCapability(CompletionCapability capability)
        {
            _capability = capability;
        }

        // /// <summary>
        // /// Get the list of completions that are commonly used by the user and are therefore stored in the system.
        // /// </summary>
        // /// //TODO: convert globalState into some json cache file
        // public static IEnumerable<StoredCompletion> getStoredCompletions(vscode.ExtensionContext context)
        // {
        //     var completions = context.globalState.get<StoredCompletion[]>(COMPLETION_STORAGE);

        //     if(completions == null) return new List<StoredCompletion>();
        //     return completions;
        // }

        const string COMPLETION_STORAGE = "commonwords";
    }

    public class StoredCompletion
    {
        public string Label { get; set; }
        public string Namespace { get; set; }
    }



}








// public constructor(private extensionContext: vscode.ExtensionContext, private server: AutoUsingServer) { }
// public async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken,
//     context: vscode.CompletionContext): Promise<vscode.CompletionList> {

// let result = await provideCompletionItems(document, position, token, context, this.extensionContext, this.server);