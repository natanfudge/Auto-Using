using System;
using System.Diagnostics;

namespace AutoUsing
{
    public class StdProxy
    {
        /// <summary>
        /// Fired when data received from the Editor.
        /// </summary>
        public event EventHandler<MessageEventArgs> EditorDataReceived;

        public void WriteData(object body = null, bool success = true)
        {
            Console.WriteLine(new Response{ Success = success, Body = body });
        }

        /// <summary>
        /// Writes given data to the server.
        /// </summary>
        public void ReadData(MessageEventArgs args)
        {
            // TODO CURRENTLY DOESN"T... JUST A PROXY
            EditorDataReceived?.Invoke(this, args);
        }
    }
}