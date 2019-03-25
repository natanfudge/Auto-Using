using System.Collections.Generic;

namespace AutoUsing.Models
{

    


    // This file will list all requests and responses, so they will be strongly typed.
    public class AddProjectsRequest
    {
        public List<string> Projects { get; set; }
    }

    public class ProjectSpecificRequest{
        public string ProjectName { get; set; }
    }

    public class GetCompletionDataRequest : ProjectSpecificRequest{
        public string WordToComplete { get; set; }
    }
    


}