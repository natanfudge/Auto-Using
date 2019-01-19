using System;
using System.Diagnostics;

namespace AutoUsing
{
    public class MessageEventArgs : EventArgs
    {
        public string Data { get; set; }

        public static implicit operator MessageEventArgs(DataReceivedEventArgs _) => new MessageEventArgs { Data = _.Data };
    }
}