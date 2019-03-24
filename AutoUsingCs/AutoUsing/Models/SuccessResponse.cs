
using AutoUsing.Proxy;

namespace AutoUsing.Models
{
    public abstract class SuccessResponse : Response
    {
        public SuccessResponse()
        {
            Success = true;
        }
    }
}