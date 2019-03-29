
using AutoUsing.Proxy;

namespace AutoUsing.Models
{
    /// <summary>
    /// The server did not succeed in performing the operation
    /// </summary>
    public class ErrorResponse : Response
    {
        public ErrorResponse()
        {
            Success = false;
        }
    }
}