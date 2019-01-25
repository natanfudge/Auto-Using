using Newtonsoft.Json;

namespace AutoUsing.Models
{
    public class Json
    {
        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}