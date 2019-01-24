using System.Collections.Generic;

namespace AutoUsing.Models
{
    public class GetAllReferencesResponse : Response<SuccessResponse>
    {
        public List<Reference> References;
    }
}