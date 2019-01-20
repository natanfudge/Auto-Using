using System.IO;
using System.Collections.Generic;
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
    }
}