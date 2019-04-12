using System;

namespace AutoUsing.Analysis.DataTypes
{
    public class Class
    {
        public Class(string name, bool generic)
        {
            Name = name;
            Generic = generic;
        }

        public string Name { get; set; }
        public bool Generic { get; set; }

        public override bool Equals(object obj)
        {
            return obj is Class @class &&
                   Name == @class.Name &&
                   Generic == @class.Generic;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Name, Generic);
        }
    }
}