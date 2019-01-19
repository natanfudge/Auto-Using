using System.IO;
using System.Collections.Generic;
namespace AutoUsing
{
    public class LibraryScanner
    {
        private LibraryScanner(string projectName, string projectDir){
            this.projectName = projectName;
            this.projectDir = projectDir;
        }

        private string projectName;
        private string projectDir;

        

        // public static List<LibraryScanner> GetScannersForAllProjects(string workspaceDir){
        //     // var scanners = Directory.GetFiles(workspaceDir,"*.csproj",SearchOption.AllDirectories).
        //     // foreach(var file in ){

        //     // }
        // }

        

    }
}