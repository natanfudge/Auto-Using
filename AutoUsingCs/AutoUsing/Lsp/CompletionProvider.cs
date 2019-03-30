using System;
using System.Threading;
using System.Threading.Tasks;
using OmniSharp.Extensions.LanguageServer.Protocol.Client.Capabilities;
using OmniSharp.Extensions.LanguageServer.Protocol.Models;
using OmniSharp.Extensions.LanguageServer.Protocol.Server;

namespace AutoUsing.Lsp
{
    public class CompletionProvider : ICompletionHandler
    {



        private readonly DocumentSelector _documentSelector = new DocumentSelector(
            new DocumentFilter()
            {
                Pattern = "**/*.cs"
            }
        );

        private CompletionCapability _capability;

        public CompletionProvider()
        {
        }

        public CompletionRegistrationOptions GetRegistrationOptions()
        {
            return new CompletionRegistrationOptions
            {
                DocumentSelector = _documentSelector,
                ResolveProvider = false
            };
        }

        public async Task<CompletionList> Handle(CompletionParams request, CancellationToken cancellationToken)
        {
            return new CompletionList(new CompletionItem { Label = "serverop" });
        }


        public void SetCapability(CompletionCapability capability)
        {
            _capability = capability;
        }
    }
}