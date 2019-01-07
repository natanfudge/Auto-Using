using System.IO;
namespace AutoUsing
{
	public class Util
	{
		public static string GetParentDir(string dir)
		{
			return Path.GetFullPath(Path.Combine(dir, @"..\"));
		}
	}
}