using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;

namespace AutoUsing.Analysis.Cache
{
    /// <summary>
    /// A list that stores some data in memory, and saves/loads it from disk as needed so some processes don't need to be redone.
    /// </summary>
    /// <typeparam name="T">The type of data cached</typeparam>
    public class Cache<T>
    {
        private string Location { get; set; }
        private List<T> Memory { get; set; }

        public Cache(string cacheLocation)
        {
            Location = cacheLocation;
            if (File.Exists(cacheLocation))
            {
                // Load from disk
                Memory = JsonConvert.DeserializeObject<List<T>>(File.ReadAllText(cacheLocation));
            }
            else
            {
                // If there is nothing in the location an empty cache is created
                Memory = new List<T>();
                var cacheDir = Directory.GetParent(Location).FullName;
                if (!Directory.Exists(cacheDir)) Directory.CreateDirectory(cacheDir);
            }
        }

        
        public void SetCache(List<T> newMemory) => Memory = newMemory;

        public List<T> Get() => Memory;

        public void Add(T toAdd) => Memory.Add(toAdd);

        public bool IsEmpty() => Memory.Count == 0;


        public void Save()
        {
            File.WriteAllText(Location, JsonConvert.SerializeObject(Memory));
        }
    }
}