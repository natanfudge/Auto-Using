using Newtonsoft.Json;

namespace AutoUsing
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
        };
    }
}