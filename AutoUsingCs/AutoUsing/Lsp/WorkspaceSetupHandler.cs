// // using System.Collections.Generic;
// // using System.Threading;
// // using System.Threading.Tasks;
// // using AutoUsing.Utils;
// // using OmniSharp.Extensions.Embedded.MediatR;
// // using OmniSharp.Extensions.JsonRpc;

// // namespace AutoUsing.Lsp
// // {
// //     public class WorkspaceSetupHandler : IJsonRpcNotificationHandler<SetupWorkspaceRequest>
// //     {
// //         public Task<Unit> Handle(SetupWorkspaceRequest request, CancellationToken cancellationToken)
// //         {
// //             Util.Log($"Recieved notification: " + request.ToIndentedJson());
// //             Server.Instance.SetupWorkspace(request);
// //             return Unit.Task;
// //         }
// //     }

//     public class SetupWorkspaceRequest : IRequest{
//         public List<string> Projects { get; set; }
//         public string WorkspaceStorageDir { get; set; }
//         public string ExtensionDir { get; set; }

//     }

    
// // }