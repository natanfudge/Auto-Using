using System.Collections.Generic;
namespace AutoUsing.Analysis.Cache
{
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