using System.Collections.Generic;
namespace playground
{
    public class ShouldShowExtensionAfterTyping
    {
        IEnumerable<string> x;
        f()
        {
            x.sel();
        }


    }


    static class TestHelper{
        static void sel(this IEnumerable<string> ien){

        }
    }
}