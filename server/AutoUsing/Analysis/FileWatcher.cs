using System.IO;

namespace AutoUsing.Analysis
{
    /// <summary>
    ///     An abstraction over the <see cref"FileSystemWatcher"/> to watch
    ///     over a single file.
    /// </summary>
    public class FileWatcher : FileSystemWatcher
    {
        public FileWatcher(string filePath)
        {
            base.Path = System.IO.Path.GetDirectoryName(filePath);
            base.Filter = System.IO.Path.GetFileName(filePath);
            base.NotifyFilter = NotifyFilters.LastAccess | NotifyFilters.LastWrite | NotifyFilters.FileName 
            | NotifyFilters.CreationTime | NotifyFilters.Attributes | NotifyFilters.DirectoryName | NotifyFilters.Security | NotifyFilters.Size;
        }
    }
}