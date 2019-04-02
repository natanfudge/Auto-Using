using System.Text;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using OmniSharp.Extensions.Embedded.MediatR;
using OmniSharp.Extensions.LanguageServer.Protocol;
using OmniSharp.Extensions.LanguageServer.Protocol.Client.Capabilities;
using OmniSharp.Extensions.LanguageServer.Protocol.Models;
using OmniSharp.Extensions.LanguageServer.Protocol.Server;
using OmniSharp.Extensions.LanguageServer.Protocol.Server.Capabilities;

namespace AutoUsing.Lsp
{
    public class TextDocumentHandler : ITextDocumentSyncHandler
    {
        private readonly ILanguageServer _router;
        // private readonly FileManager _bufferManager;

        private readonly DocumentSelector _documentSelector = new DocumentSelector(
            new DocumentFilter()
            {
                Pattern = "**/*.cs"

            }
        );

        private SynchronizationCapability _capability;

        // public TextDocumentHandler(ILanguageServer router, FileManager bufferManager)
        // {
        //     _router = router;
        //     _bufferManager = bufferManager;
        // }

        public TextDocumentSyncKind Change { get; } = TextDocumentSyncKind.Full;

        public TextDocumentChangeRegistrationOptions GetRegistrationOptions()
        {
            return new TextDocumentChangeRegistrationOptions()
            {
                DocumentSelector = _documentSelector,
                SyncKind = Change
            };
        }

        public TextDocumentAttributes GetTextDocumentAttributes(Uri uri)
        {
            return new TextDocumentAttributes(uri, "xml");
        }

        public Task<Unit> Handle(DidChangeTextDocumentParams request, CancellationToken cancellationToken)
        {
            var documentPath = request.TextDocument.Uri.ToString();
            var text = request.ContentChanges.FirstOrDefault()?.Text;

            // _bufferManager.UpdateBuffer(documentPath, new StringBuilder(text));
            FileManager.UpdateBuffer(documentPath, new StringBuilder(text));

            // _router.Window.LogInfo($"Updated buffer for document: {documentPath}\n{text}");

            return Unit.Task;
        }

        public Task<Unit> Handle(DidOpenTextDocumentParams request, CancellationToken cancellationToken)
        {
            // _bufferManager.UpdateBuffer(request.TextDocument.Uri.ToString(), new StringBuilder(request.TextDocument.Text));
            FileManager.UpdateBuffer(request.TextDocument.Uri.ToString(), new StringBuilder(request.TextDocument.Text));
            return Unit.Task;
        }

        public Task<Unit> Handle(DidCloseTextDocumentParams request, CancellationToken cancellationToken)
        {
            return Unit.Task;
            throw new NotImplementedException();
        }

        public Task<Unit> Handle(DidSaveTextDocumentParams request, CancellationToken cancellationToken)
        {
            return Unit.Task;
            throw new NotImplementedException();
        }

        public void SetCapability(SynchronizationCapability capability)
        {

            // throw new NotImplementedException();
        }

        TextDocumentRegistrationOptions IRegistration<TextDocumentRegistrationOptions>.GetRegistrationOptions()
        {
            return GetRegistrationOptions();
            // throw new NotImplementedException();
        }

        TextDocumentSaveRegistrationOptions IRegistration<TextDocumentSaveRegistrationOptions>.GetRegistrationOptions()
        {
            return new TextDocumentSaveRegistrationOptions { DocumentSelector = _documentSelector };
        }


    }
}