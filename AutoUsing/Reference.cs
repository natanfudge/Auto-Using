using System.Collections.Generic;
using System;

namespace AutoUsing
{
	public class Reference
	{
		public Reference() { }

		public Reference(string name, List<string> namespaces)
		{
			this.name = name;
			this.namespaces = namespaces;
		}

		public string name { get; set; }
		public List<string> namespaces { get; set; }

		public override bool Equals(object obj)
		{
			var reference = obj as Reference;
			return reference != null &&
				   name == reference.name &&
				   EqualityComparer<List<string>>.Default.Equals(namespaces, reference.namespaces);
		}

		public override int GetHashCode()
		{
			return HashCode.Combine(name, namespaces);
		}
	}

	public class SpecificReference
	{

	}
}