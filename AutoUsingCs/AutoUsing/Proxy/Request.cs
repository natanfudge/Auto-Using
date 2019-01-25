using Newtonsoft.Json;

namespace AutoUsing.Proxy
{
    /// <summary>
    ///     A request received from Visual Studio Code.
    /// </summary>
    public class Request
    {
        public string Command { get; set; }

        public object Arguments { get; set; }

        public static implicit operator Request(string json) => JsonConvert.DeserializeObject<Request>(json, Serializer.Settings);

        public static implicit operator string(Request request) => JsonConvert.SerializeObject(request, Serializer.Settings);

        public T Specificly<T>(){
            return JsonConvert.DeserializeObject<T>(JsonConvert.SerializeObject( Arguments), Serializer.Settings);
        }

    }

    // public class RequestArgs<T>
    // {
    // }


}