using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;

namespace AutoUsing.Analysis.Cache
{
    public class Cache<T>
    {
        private string Location { get; set; }
        private List<T> Memory { get; set; }

        public Cache(string cacheLocation)
        {
            Location = cacheLocation;
            if (File.Exists(cacheLocation))
            {
                Memory = JsonConvert.DeserializeObject<List<T>>(File.ReadAllText(cacheLocation));
            }
            else
            {
                Memory = new List<T>();
                var cacheDir = Directory.GetParent(Location).FullName;
                if (!Directory.Exists(cacheDir)) Directory.CreateDirectory(cacheDir);
            }
        }

        public void Set(List<T> newMemory) => Memory = newMemory;

        public List<T> Get() => Memory;

        public void Add(T toAdd) => Memory.Add(toAdd);

        public bool IsEmpty() => Memory.Count == 0;


        public void Save()
        {
            File.WriteAllText(Location, JsonConvert.SerializeObject(Memory));
        }
    }
}