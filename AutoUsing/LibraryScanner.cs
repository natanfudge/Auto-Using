using System.IO;
using System.Collections.Generic;
using System.Linq;
namespace AutoUsing
{
    public class LibraryScanner
    {
        private LibraryScanner(string projectName, string projectDir){
            this.ProjectName = projectName;
            this.ProjectDir = projectDir;
        }

        private string ProjectName;
        private string ProjectDir;

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        // public static List<LibraryScanner> GetLibraryScannersForAllProjects(string workspaceDir){
        //     foreach(var dir in Directory.GetDirectories(workspaceDir,"*",SearchOption.AllDirectories)){
        //         var files = Directory.GetFiles(dir);
        //         files.co
        //         if()
        //     }
        // }

        
    }
}

