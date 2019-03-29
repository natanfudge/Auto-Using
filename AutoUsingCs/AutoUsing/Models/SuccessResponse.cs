
using AutoUsing.Proxy;

namespace AutoUsing.Models
{
    /// <summary>
    /// The server succeeded in performing the operation
    /// </summary>
    public abstract class SuccessResponse : Response
    {
        public SuccessResponse()
        {
            Success = true;
        }
    }
}