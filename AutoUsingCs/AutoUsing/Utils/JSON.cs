using AutoUsing.Proxy;
using MessagePack;
using Newtonsoft.Json;
using Utf8Json;
using Utf8Json.Resolvers;

namespace AutoUsing.Utils
{
    public class JSON
    {

        // private static 
        public static T Parse<T>(string json)
        {
            // return JsonSerializer.Deserialize<T>(json,StandardResolver.AllowPrivateCamelCase);

            return JsonConvert.DeserializeObject<T>(json, Serializer.Settings);
            // IJsonFormatterResolver
        }
    }
}