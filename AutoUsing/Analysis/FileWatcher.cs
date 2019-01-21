
using System.IO;

namespace AutoUsing
{
    public class FileWatcher : FileSystemWatcher
    {
        public FileWatcher(string filePath)
        {
            base.Path = System.IO.Path.GetDirectoryName(filePath);
            base.Filter = System.IO.Path.GetFileName(filePath);
            base.NotifyFilter = NotifyFilters.LastAccess | NotifyFilters.LastWrite | NotifyFilters.FileName;
        }
    }
}