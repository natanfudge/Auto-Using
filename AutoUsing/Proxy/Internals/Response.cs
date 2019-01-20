using Newtonsoft.Json;

namespace AutoUsing
{
    /// <summary>
    /// The JSON serialized response returned to Visual Studio Code. 
    /// </summary>
    public class Response
    {
        public bool Success { get; set; }
        public object Body { get; set; }

        public static implicit operator Response(string json) => JsonConvert.DeserializeObject<Response>(json, Serializer.Settings);
        
        public static implicit operator string(Response response) => JsonConvert.SerializeObject(response, Serializer.Settings);
            
    }
}