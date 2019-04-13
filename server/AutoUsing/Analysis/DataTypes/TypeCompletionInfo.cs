namespace AutoUsing.Analysis.DataTypes
{
    /// <summary>
    /// Information about a class that is stored and then used to produce completions for classes
    /// </summary>
    public class TypeCompletionInfo
    {
        public string Name { get; set; }
        public string Namespace { get; set; }

        public TypeCompletionInfo(string name, string ns)
        {
            Name = name;
            Namespace = ns;
        }



        protected bool Equals(TypeCompletionInfo other)
        {
            return string.Equals(Name, other.Name) && string.Equals(Namespace, other.Namespace);
        }

        public override bool Equals(object obj)
        {
            if (obj is null) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != this.GetType()) return false;
            return Equals((TypeCompletionInfo)obj);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return ((Name != null ? Name.GetHashCode() : 0) * 397) ^ (Namespace != null ? Namespace.GetHashCode() : 0);
            }
        }
    }
}