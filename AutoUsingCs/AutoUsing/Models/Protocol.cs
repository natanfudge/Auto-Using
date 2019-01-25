using System.Collections.Generic;

namespace AutoUsing.Models
{

    


    // This file will list all requests and responses, so they will be strongly typed.
    public class AddProjectsRequest : Json
    {
        public List<string> Projects { get; set; }
    }

    public class GetAllReferencesRequest : Json
    {


        public string ProjectName { get; set; }
        public string WordToComplete { get; set; }
    }


}