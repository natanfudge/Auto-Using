using AutoUsing.Utils;
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

        public static implicit operator Request(string json) => JSON.Parse<Request>(json);

        public static implicit operator string(Request request) => JsonConvert.SerializeObject(request, Serializer.Settings);

        /// <summary>
        /// Converts a request into a specific request class
        /// </summary>
        /// //TODO: optimize this method (not that important)
        public T Specificly<T>()
        {
            return JsonConvert.DeserializeObject<T>(JsonConvert.SerializeObject(Arguments), Serializer.Settings);
        }

    }

    // public class RequestArgs<T>
    // {
    // }


}