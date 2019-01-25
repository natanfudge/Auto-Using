
using AutoUsing.Proxy;

namespace AutoUsing.Models
{
    public class ErrorResponse : Response
    {
        public ErrorResponse()
        {
            Success = false;
        }
    }
}