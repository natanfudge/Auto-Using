using Newtonsoft.Json.Linq;
namespace playground
{
    public class ShouldShowExtensionsForLibrary
    {
        JToken x;
        void f(){
            x.val();
        }
    }

    public static class TestHelper2{
        public static void val(this JToken x){}
    }
}