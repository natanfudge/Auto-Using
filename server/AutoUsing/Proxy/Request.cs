namespace AutoUsing.Proxy
{
    /// <summary>
    ///     A request received from Visual Studio Code.
    /// </summary>
    public class Request
    {
        /// <summary>
        /// The operation to be performed by the server
        /// </summary>
        public string Command { get; set; }

        /// <summary>
        /// Data required to perform the operation 
        /// </summary>
        public object Arguments { get; set; }


    }
}