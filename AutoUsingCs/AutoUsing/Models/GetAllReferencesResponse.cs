using System.Collections.Generic;
using AutoUsing.Analysis.DataTypes;
using AutoUsing.Proxy;

namespace AutoUsing.Models
{
    public class GetAllReferencesResponse : SuccessResponse
    {
        public GetAllReferencesResponse(List<Reference> References){
            this.Body = References;
        }
    }
}