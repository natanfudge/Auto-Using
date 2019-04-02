using System.Collections.Generic;
using System;
using System.Linq;
using System.IO;
namespace AutoUsing.Lsp
{
    public class VscodeUtil
    {
        const string projectExtension = ".csproj";
        public static string GetProjectName(string filePath)
        {
            // var projectDir = GetProjectFile(filePath);
            // var files = Directory.GetFiles(projectDir, $"*{projectExtension}");
            // if (files.Count() > 1) throw new InvalidOperationException("Did not expect more than 1 project file in directory!");

            var projectFile = GetProjectFile(filePath);
            return Path.GetFileNameWithoutExtension(projectFile);
        }

        public static string GetProjectFile(string filePath)
        {            
            return FindInParentDirectories(filePath, $"*{projectExtension}");
        }

        /// <summary>
        /// Searches up the folder hierarchy until it finds a file with the given pattern.
        /// Once a file matching the pattern was found it is returned.
        /// </summary>
        public static string FindInParentDirectories(string path, string pattern)
        {
            // Substring(1) because the path has too many slashes at the start.
            var currentDir =  Path.GetDirectoryName(path).Substring(1);
            while (currentDir != null)
            {
                var files = Directory.GetFiles(currentDir, pattern);
                if (files.Length > 0)
                {
                    if (files.Length > 1) throw new InvalidOperationException("Did not expect more than 1 project file in directory!");
                    return files[0];
                }
                currentDir = Directory.GetParent(currentDir).FullName;
            }
            throw new InvalidOperationException("Could not find project file!");
        }
    }
}