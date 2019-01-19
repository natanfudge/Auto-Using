using System.Collections.Generic;
namespace assets
{
    public class ShouldShowExtendAfterParentheses
    {
        void x(){
            IEnumerable<string> x = null;
            (((x))).Equals(2);
        }
    }
}