using System;
using System.Diagnostics;
using Newtonsoft.Json;

namespace AutoUsing
{
    public class IOProxy
    {
        /// <summary>
        /// Fired when data received from the Editor.
        /// </summary>
        public event EventHandler<MessageEventArgs> EditorDataReceived;

        public void WriteData(Response response)
        {
            Console.WriteLine(JsonConvert.SerializeObject(response, Serializer.Settings));
        }

        /// <summary>
        /// Writes given data to the server.
        /// </summary>
        public void ReadData(MessageEventArgs args)
        {
            EditorDataReceived?.Invoke(this, args);
        }
    }
}