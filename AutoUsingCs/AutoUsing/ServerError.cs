using System;
namespace AutoUsing
{
    public class ServerException : Exception
    {
        public ServerException(string message) : base($"Server threw an error:{message}") { }
    }
}