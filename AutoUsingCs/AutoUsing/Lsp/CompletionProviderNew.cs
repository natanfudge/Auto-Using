
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using OmniSharp.Extensions.LanguageServer.Protocol.Client.Capabilities;
using OmniSharp.Extensions.LanguageServer.Protocol.Models;
using OmniSharp.Extensions.LanguageServer.Protocol.Server;

namespace AutoUsing.Lsp
{
    class CompletionProviderNew : ICompletionHandler
    {

        Server server = new Server();

        const int maxCompletionAmount = 100;

        public CompletionRegistrationOptions GetRegistrationOptions()
        {
            throw new System.NotImplementedException();


        }

        public async Task<CompletionList> Handle(CompletionParams request, CancellationToken cancellationToken)
        {
            var result = await CompletionInstance.ProvideCompletionItems(request,server);
            return result;
        }

        public void SetCapability(CompletionCapability capability)
        {
            throw new System.NotImplementedException();
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

	public class StoredCompletion{
		public string Label{get;set;}
		public string Namespace{get;set;}
	}



}








// public constructor(private extensionContext: vscode.ExtensionContext, private server: AutoUsingServer) { }
// public async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken,
//     context: vscode.CompletionContext): Promise<vscode.CompletionList> {

// let result = await provideCompletionItems(document, position, token, context, this.extensionContext, this.server);