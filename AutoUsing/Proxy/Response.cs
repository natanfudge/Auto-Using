using Newtonsoft.Json;

namespace AutoUsing
{
    /// <summary>
    /// The JSON serialized response returned to Visual Studio Code. 
    /// </summary>
    public class Response<T>
    {
        public bool Success { get; set; }
        public object Body { get; set; }

        public static implicit operator Response<T>(string json) => JsonConvert.DeserializeObject<Response<T>>(json, Serializer.Settings);
        
        public static implicit operator string(Response<T> response) => JsonConvert.SerializeObject(response, Serializer.Settings);
    }
}