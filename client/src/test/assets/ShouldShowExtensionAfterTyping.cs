using System.Collections.Generic;
namespace playground
{
    public class ShouldShowExtensionAfterTyping
    {
        IEnumerable<string> x;
        void f()
        {
            x.sel();
        }


    }


    public static class TestHelper{
       public static void sel(this IEnumerable<string> ien){

        }
    }
}