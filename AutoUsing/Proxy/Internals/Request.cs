using Newtonsoft.Json;

namespace AutoUsing
{
    /// <summary>
    /// A request received from Visual Studio Code.
    /// </summary>
    public class Request
    {
        public string Command { get; set; }

        public string Arguments { get; set; }

        public static implicit operator Request(string json) => JsonConvert.DeserializeObject<Request>(json, Serializer.Settings);

        public static implicit operator string(Request request) => JsonConvert.SerializeObject(request, Serializer.Settings);

    }
}