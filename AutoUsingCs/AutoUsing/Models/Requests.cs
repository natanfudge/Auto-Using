using System.Collections.Generic;

namespace AutoUsing.Models
{

    // This file will list all requests and responses, so they will be strongly typed.

    /// <summary>
    /// Runs whenever the extension is activated
    /// </summary>
    public class SetupWorkspaceRequest
    {
        public List<string> Projects { get; set; }
        public string WorkspaceStorageDir { get; set; }
        public string ExtensionDir { get; set; }

    }
    public class ProjectSpecificRequest
    {
        public string ProjectName { get; set; }
    }

    public class GetCompletionDataRequest : ProjectSpecificRequest
    {
        public string WordToComplete { get; set; }
    }


}