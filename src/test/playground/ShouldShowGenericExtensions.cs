using System.Linq;
using System.Collections.Generic;
namespace Showspace
{
    class Showcase
    {
        void x()
        {
            IEnumerable<string> x = null;
            var y = x.Select(z => z+="Hooray!");
            
        }
    }
}