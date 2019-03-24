namespace AutoUsing.Models
{
    public class PingResponse : SuccessResponse
    {
        public PingResponse(){
            Body = "pong";
        }
    }
}