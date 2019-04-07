using System;
using System.Linq;
using System.Collections.Generic;
using System.Reflection;
using Newtonsoft.Json;

namespace AutoUsingTest
{
    public static class TestUtil
    {
        public static void AssertContains<T>(this IEnumerable<T> list, T element)
        {
            if (!list.Contains(element))
            {
                throw new AssertionException(
                    $"Expected list to contain **{element.ToJson()}** but actually contains  **{list.ToJson()}**");
            }
        }

        public static string ToJson(this object obj)
        {
            return JsonConvert.SerializeObject(obj, Formatting.Indented);
        }


        public static T GetPrivateField<T>(object obj, string fieldName)
        {
            FieldInfo fi = obj.GetType().GetField(fieldName, BindingFlags.NonPublic | BindingFlags.Instance);
            return (T)fi.GetValue(obj);
        }
    }

    public class AssertionException : Exception
    {
        public AssertionException(string str) : base(str)
        {
        }
    }
}