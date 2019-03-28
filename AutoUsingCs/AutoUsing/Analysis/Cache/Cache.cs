using System;
using System.Linq;
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
        /// <summary>
        /// The location in the disk the cache files are stored
        /// </summary>
        private string Location { get; set; }
        /// <summary>
        /// The data that is currently stored in the program's memory, alongside identifiers for the data
        /// </summary>
        private List<CachedObject<T>> Memory { get; set; }

        public Cache(string cacheLocation)
        {
            Location = cacheLocation;
            if (File.Exists(cacheLocation))
            {
                // Load from disk
                Memory = JsonConvert.DeserializeObject<List<CachedObject<T>>>(File.ReadAllText(cacheLocation));
            }
            else
            {
                // If there is nothing in the location an empty cache is created
                Memory = new List<CachedObject<T>>();
                var cacheDir = Directory.GetParent(Location).FullName;
                if (!Directory.Exists(cacheDir)) Directory.CreateDirectory(cacheDir);
            }
        }


        /// <summary>
        /// Replaces the memory of the cache with different objects
        /// </summary>
        public void SetCache(List<CachedObject<T>> newMemory) => Memory = newMemory;

        // public List<T> GetCache() => Memory.SelectMany(cache => cache.Content).ToList();

        /// <summary>
        /// Returns the data that is cached in memory without identifiers.
        /// </summary>
        public List<T> GetCache()
        {
            try
            {
                return Memory.SelectMany(cache => cache.Content).ToList();
            }
            catch (ArgumentNullException)
            {
                // Invalid cache
                Util.Log($"Invalid cache at path {Location}. Cleaning Cache.");
                Memory = new List<CachedObject<T>>();
                Save();
                return new List<T>();
            }

        }

        /// <summary>
        /// Inserts additional data the cache's memory with strings that identify the data.
        /// </summary>
        public void AddCache(IEnumerable<CachedObject<T>> toAdd)
        {
            foreach (var data in toAdd) Memory.Add(data);
        }

        /// <summary>
        /// Removes all of the data from the cache with the specified identifiers.
        /// </summary>
        public void RemoveCache(IEnumerable<string> identifiers)
        {
            Memory.RemoveAll(data => identifiers.Contains(data.Identifier));
        }

        /// <summary>
        /// Returns a list of identifiers of ALL the data that is stored in the cache's memory
        /// </summary>
        public IEnumerable<string> GetIdentifiers()
        {
            return Memory.Select(data => data.Identifier);
        }

        /// <summary>
        /// Checks if there is anything stored in the cache.
        /// </summary>
        public bool IsEmpty() => Memory.Count == 0;


        /// <summary>
        /// Saves the cache to disk
        /// </summary>
        public void Save()
        {
            File.WriteAllText(Location, JsonConvert.SerializeObject(Memory));
        }

    }
}