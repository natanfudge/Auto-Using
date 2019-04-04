using System.Collections.Concurrent;
using System.Text;

namespace AutoUsing.Lsp
{
    public static class FileManager
    {

        
        private static ConcurrentDictionary<string, StringBuilder> buffers = new ConcurrentDictionary<string, StringBuilder>();

        public static void UpdateBuffer(string documentPath, StringBuilder buffer)
        {
            buffers.AddOrUpdate(documentPath, buffer, (k, v) => buffer);
        }

        public static StringBuilder GetBuffer(string documentPath)
        {
            return buffers.TryGetValue(documentPath, out var buffer) ? buffer : null;
        }

    }
}