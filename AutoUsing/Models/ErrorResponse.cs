
namespace AutoUsing
{
    public class ErrorResponse : Response<ErrorResponse>
    {
        public ErrorResponse()
        {
            Success = false;
        }
    }
}