using System;
using System.Linq;
using System.Collections.Generic;
using Newtonsoft.Json;
namespace AutoUsingTest
{
    public static class TestUtil
    {
        public static void AssertContains<T>(this IEnumerable<T> list, T element)
        {
            if (!list.Contains(element))
            {
                throw new AssertionException($"Expected list to contain **{element.ToJson()}** but actually contains  **{list.ToJson()}**");
            }
        }

        public static string ToJson(this object obj){
            return JsonConvert.SerializeObject(obj,Formatting.Indented);
        }
    }

    public class AssertionException : Exception
    {
        public AssertionException(string str) : base(str){
        }
    }
}