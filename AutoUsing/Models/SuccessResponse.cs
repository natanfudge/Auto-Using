
namespace AutoUsing
{
    public class SuccessResponse : Response<ErrorResponse>
    {
        public SuccessResponse()
        {
            Success = true;
        }
    }
}