using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;

namespace AutoUsing.Utils
{
    public static class JSON
    {

        public static class Serializer
    {
        public static readonly JsonSerializerSettings Settings = new JsonSerializerSettings
        {
            MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
            DateParseHandling = DateParseHandling.None,
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };
    }

        // private static 
        public static T Parse<T>(string json)
        {
            // return JsonSerializer.Deserialize<T>(json,StandardResolver.AllowPrivateCamelCase);

            return JsonConvert.DeserializeObject<T>(json, Serializer.Settings);
            // IJsonFormatterResolver
        }

        public static string Stringify<T>(T obj)
        {
            //test
            return JsonConvert.SerializeObject(obj, Serializer.Settings);
        }

        public static string ToIndentedJson(this object obj)
        {
            return JsonConvert.SerializeObject(obj, Formatting.Indented);
        }

        // public static T To<T>(this Jtokeb str)
        // {
            
        //     return JsonConvert.DeserializeObject<T>(str,Serializer.Settings);
        // }
    }
}