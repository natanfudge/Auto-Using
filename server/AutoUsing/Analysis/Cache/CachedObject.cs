using System.Collections.Generic;
namespace AutoUsing.Analysis.Cache
{
    /// <summary>
    /// Data to be stored in the cache alongside a string that identifies the data
    /// </summary>
    /// <typeparam name="T">The type of data that is stored in the cache</typeparam>
    public class CachedObject<T>
    {
        public CachedObject(List<T> content, string identifier)
        {
            Content = content;
            Identifier = identifier;
        }

        public string Identifier { get; set; }
        public List<T> Content { get; set; }
    }
}