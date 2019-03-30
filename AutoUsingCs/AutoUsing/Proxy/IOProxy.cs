using System;
using Newtonsoft.Json;

namespace AutoUsing.Proxy
{
    public class IOProxy
    {
        /// <summary>
        /// Fired when data received from the Editor.
        /// </summary>
        public event EventHandler<MessageEventArgs> EditorDataReceived;

        /// <summary>
        /// Writes given response to the server.
        /// </summary>
        public void WriteData(Response response)
        {
            var str = JsonConvert.SerializeObject(response, Serializer.Settings);
            Console.WriteLine(str);
        }

        public void ReadData(MessageEventArgs args)
        {
            EditorDataReceived?.Invoke(this, args);
        }
    }
}