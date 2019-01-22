using Newtonsoft.Json;

namespace AutoUsing
{
    /// <summary>
    ///     The JSON serialized response returned to Visual Studio Code. 
    /// </summary>
<<<<<<< HEAD
    /// <typeparam name="T">
    ///     A class that inherits <see cref="Response"/> 
    ///     Enables the implicit operator to serialize to and from any class inheriting this.
    /// </typeparam>
    public abstract class Response<T>
=======
    public class Response<T>
>>>>>>> upstream/master
    {
        public bool Success { get; set; }
        public object Body { get; set; }

        public static implicit operator Response<T>(string json) => JsonConvert.DeserializeObject<Response<T>>(json, Serializer.Settings);

        public static implicit operator string(Response<T> response) => JsonConvert.SerializeObject(response, Serializer.Settings);
    }
}