using System;
using System.Diagnostics;

namespace AutoUsing
{
    public class IOProxy
    {
        /// <summary>
        /// Fired when data received from the Editor.
        /// </summary>
        public event EventHandler<MessageEventArgs> EditorDataReceived;

        public void WriteData(object response)
        {
            Console.WriteLine(response);
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