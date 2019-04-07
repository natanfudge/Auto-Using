using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace AutoUsing.Proxy
{
    /// <summary>
    ///     Json serialization settings.
    /// </summary>
    public static class Serializer
    {
        public static readonly JsonSerializerSettings Settings = new JsonSerializerSettings
        {
            MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
            DateParseHandling = DateParseHandling.None,
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };
    }
}