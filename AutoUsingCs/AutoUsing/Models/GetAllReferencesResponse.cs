using System.Collections.Generic;
using AutoUsing.Analysis.DataTypes;
using AutoUsing.Proxy;

namespace AutoUsing.Models
{
    public class GetAllReferencesResponse : Response
    {
        public List<Reference> References;
    }
}