using System;
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

    public class GetAllTypesResponse : SuccessResponse
    {
        public GetAllTypesResponse(List<TypeCompletion> Types)
        {
            this.Body = Types;
        }
    }

    public class GetAllExtensionMethodsResponse : SuccessResponse
    {
        public GetAllExtensionMethodsResponse(List<ExtensionClass> Extensions)
        {
            this.Body = Extensions;
        }
    }
    public class GetAllHierachiesResponse : SuccessResponse
    {
        public GetAllHierachiesResponse(List<Hierarchies> Hierarchies)
        {
            this.Body = Hierarchies;
        }

        override public bool Equals(object obj)
        {
            var otherResponse = obj as GetAllHierachiesResponse;
            if (otherResponse == null) return false;

            var otherHierarchies = otherResponse.Body as List<Hierarchies>;
            var thisHierarchies = this.Body as List<Hierarchies>;
            return thisHierarchies.SequenceEqual(otherHierarchies) && otherResponse.Success == this.Success;
        }

        override public int GetHashCode()
        {
            return HashCode.Combine(this.Body, this.Success);
        }


    }



}