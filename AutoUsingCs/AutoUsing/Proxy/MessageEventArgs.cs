using System;
using System.Diagnostics;

namespace AutoUsing
{
    /// <summary>
    ///     Encapsulated representation of data received or sent to the console.
    /// </summary>
    public class MessageEventArgs : EventArgs
    {
        public string Data { get; set; }

        public static implicit operator MessageEventArgs(DataReceivedEventArgs _) => new MessageEventArgs { Data = _.Data };
    }
}