namespace AutoUsing.Proxy
{
    /// <summary>
    ///     The JSON serialized response returned to Visual Studio Code. 
    /// </summary>

    public class Response{
        public bool Success { get; set; }
        public object Body { get; set; }
    }
}