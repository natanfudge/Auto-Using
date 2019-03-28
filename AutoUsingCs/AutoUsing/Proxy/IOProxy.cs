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

        // private int count = 0;
        public void WriteData(Response response)
        {
            // count++;
            // Util.Log("WRITE DATA NUMBER " + count);
            // Util.Log("Sending response OBJECT = " + response.ToIndentedJson());
            var str = JsonConvert.SerializeObject(response, Serializer.Settings);
            Console.WriteLine(str);
            // Util.Log("Sending response STRING = " + str);
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