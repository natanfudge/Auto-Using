using System.Linq;
using System.Collections.Generic;
namespace assets
{
    public class ShouldShowExtensionsAfterParams
    {
        void x()
        {
            IEnumerable<string> x = null;
            x.Select(str => (str+="test")).First();
        }
    }
}