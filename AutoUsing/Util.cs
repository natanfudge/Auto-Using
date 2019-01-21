using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;
using AutoUsing.DataTypes;

namespace AutoUsing
{
    public static class Util
    {
        public static bool IsNullOrEmpty(this string value)
        {
            return string.IsNullOrEmpty(value);
        }

        public static string ToCamelCase(this string value)
        {
            string result = string.Empty;

            for (int i = 0; i < value.Length; i++)
            {
                char c = value[i];
                char p = i == 0 ? char.MinValue : value[i - 1];

                result += ((p is ' ') || p is char.MinValue ) ? $"{char.ToLower(c)}" : $"{c}";    
            }

            return result;
        }

        public static string GetParentDir(string dir)
        {
            return Path.GetFullPath(Path.Combine(dir, @"..\"));
        }

        public static List<MethodInfo> GetExtensionMethods(this Type @class)
        {
            return @class.GetMethods(BindingFlags.Static | BindingFlags.Public)
                .Where(method => method.IsDefined(typeof(ExtensionAttribute), false)).ToList();
        }

        public static bool IsStatic(this Type @class){
            return @class.IsAbstract && @class.IsSealed;
        }

        public static Type GetExtendedClass(this MethodInfo method)
        {
            return method.GetParameters()[0].ParameterType;
        }

        public static Dictionary<K, V> ToDictionary<K, V>(this IEnumerable<KeyValuePair<K, V>> map)
        {
            return map.ToDictionary(kv => kv.Key, kv => kv.Value);
        }

        public static string NoTilde(this string str){
            if (str == null) return null;
            if (str.Length < 2) return str;

            var possibleTilde = str[str.Length - 2];

            if (possibleTilde == '`') return str.Substring(0, str.Length - 2);

            if (str.Length < 3) return str;

            possibleTilde = str[str.Length - 3];

            if (possibleTilde == '`') return str.Substring(0, str.Length - 3);

            return str;
        }

    }
}