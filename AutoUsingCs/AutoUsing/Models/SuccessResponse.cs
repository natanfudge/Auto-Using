
namespace AutoUsing
{
    public class SuccessResponse : Response<SuccessResponse>
    {
        public SuccessResponse()
        {
            Success = true;
        }
    }
}