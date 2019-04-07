using System.IO;
namespace assets
{
    public class ShouldNotShowExtensionsForStatic
    {
        void x(){
            File.WriteAllText("123","123");
        }      
    }
}