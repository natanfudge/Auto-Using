using AutoUsing.Proxy;
using MessagePack;
using Newtonsoft.Json;
using Utf8Json;
using Utf8Json.Resolvers;

namespace AutoUsing.Utils
{
    public static class JSON
    {

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