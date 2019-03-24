using AutoUsing.Proxy;
using Newtonsoft.Json;

namespace AutoUsing.Models
{
    public class EmptyResponse : SuccessResponse
    {
        public EmptyResponse(){
            this.Body = "";
        }
        

        // class EmptyObject{

        // }

    }
}