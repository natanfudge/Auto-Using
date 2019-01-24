using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;

namespace AutoUsing.Proxy
{
    public static class Cache
    {
        public static Cache<Reference> References = new Cache<Reference>("C:/Users/natan/Desktop/Auto-Using-Git/out/cache");
    }
    public class Cache<T>
    {



        private string Location { get; set; }
        public List<T> Memory { get; set; }
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
            }

        }


        public void Add(T toAdd)
        {
            Memory.Add(toAdd);
        }

        public void Save()
        {
            File.WriteAllText(Location, JsonConvert.SerializeObject(Memory));
        }

    }
}