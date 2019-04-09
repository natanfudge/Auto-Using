using System.Collections.Generic;
using System.Linq;
using AutoUsing.Utils;

namespace AutoUsingTest
{
    public static class AssertExtensions
    {
        public static void ShouldNotContain<T>(this List<T> list, T element, string message = "")
        {
            var index = list.FindIndex(e => e.Equals(element));
            if (index != -1)
            {
                throw new AssertionException(
                    $@"Failed to assert that ${message}!
Expected list to not contain element: ${element.ToIndentedJson()} but it contains it at index {index}.
The content of the list is as follows: \n{list.ToIndentedJson()}
");
            }
        }


        public static void ShouldContain<T>(this IEnumerable<T> list, T element, string message = "")
        {
            if (!list.Contains(element))
            {
                throw new AssertionException(
                    $@"Failed to assert that ${message}!
Expected list to contain element: ${element.ToIndentedJson()} but it does not contain it.
The content of the list is as follows: \n{list.ToIndentedJson()}
");
            }
        }
    }
}