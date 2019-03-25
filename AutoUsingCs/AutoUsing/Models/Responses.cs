using System.Linq;
using System.Collections.Generic;
using AutoUsing.Analysis.DataTypes;

namespace AutoUsing.Models
{
    public class PingResponse : SuccessResponse
    {
        public PingResponse()
        {
            Body = "pong";
        }
    }



    public class EmptyResponse : SuccessResponse
    {
        public EmptyResponse()
        {
            this.Body = "";
        }

    }

    public class GetAllReferencesResponse : SuccessResponse
    {
        public GetAllReferencesResponse(List<Reference> References)
        {
            this.Body = References;
        }
    }

    public class GetAllExtensionMethodsResponse : SuccessResponse
    {
        public GetAllExtensionMethodsResponse(List<ExtensionClass> References)
        {
            this.Body = References;
        }
    }
    public class GetAllHierachiesResponse : SuccessResponse
    {
        public GetAllHierachiesResponse(List<Hierarchies> References)
        {
            this.Body = References;
        }

        override public bool Equals(object obj){
            var otherResponse = obj as GetAllHierachiesResponse;
            if(otherResponse == null) return false;

            var otherReferences = otherResponse.Body as List<Hierarchies>;
            var thisReferences = this.Body as List<Hierarchies>;
            return thisReferences.SequenceEqual(otherReferences) && otherResponse.Success == this.Success;
        }
    }


}