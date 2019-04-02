using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;
using Newtonsoft.Json;

namespace AutoUsing.Utils
{
    public static class Util
    {
        /// <summary>
        ///     Indicates whether the specified string is null or an System.String.Empty string.
        /// </summary>
        /// <param name="value">The string to test.</param>
        /// <returns>true if the value parameter is null or an empty string; otherwise, false.</returns>
        public static bool IsNullOrEmpty(this string value)
        {
            return string.IsNullOrEmpty(value);
        }


        /// <summary>
        /// Gets all the extension methods defined in a class.
        /// </summary>
        public static List<MethodInfo> GetExtensionMethods(this Type @class)
        {
            return @class.GetMethods(BindingFlags.Static | BindingFlags.Public)
                .Where(method => method.IsDefined(typeof(ExtensionAttribute), false)).ToList();
        }

        /// <summary>
        /// Returns whether or not a type is a static class
        /// </summary>
        public static bool IsStatic(this Type @class)
        {
            return @class.IsAbstract && @class.IsSealed;
        }

        /// <summary>
        ///     Extension method info.
        /// </summary>
        /// <returns>The class the method is extending</returns>
        public static Type GetExtendedClass(this MethodInfo method)
        {
            return method.GetParameters()[0].ParameterType;
        }

        public static Dictionary<K, V> ToDictionary<K, V>(this IEnumerable<KeyValuePair<K, V>> map)
        {
            return map.ToDictionary(kv => kv.Key, kv => kv.Value);
        }

        /// <summary>
        ///     Removes the tilde (`) that sometimes appears at the end of class names.
        ///     For example List`1 => List
        /// </summary>
        public static string NoTilde(this string str)
        {
            if (str == null) return null;
            if (str.Length < 2) return str;

            var possibleTilde = str[str.Length - 2];

            if (possibleTilde == '`') return str.Substring(0, str.Length - 2);

            if (str.Length < 3) return str;

            possibleTilde = str[str.Length - 3];

            if (possibleTilde == '`') return str.Substring(0, str.Length - 3);

            return str;
        }


        /// <summary>
        /// Converts a path with environment variables into an actual path,
        ///  for example "${UserProfile}/.nuget/amar" => "C:/users/natan/.nuget/amar"
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public static string ParseEnvironmentVariables(this string path)
        {
            var directories = path.Split(Path.DirectorySeparatorChar);
            var parsed = directories.Select(dir =>
            {
                if (dir.StartsWith("$"))
                {
                    var variable = dir.Substring(2, dir.Length - 3);
                    var result = Environment.GetEnvironmentVariable(variable);
                    return result;
                }
                else return dir;
            });
            var joined = string.Join(Path.DirectorySeparatorChar, parsed);

            return joined;
        }


        /// <summary>
        /// Checks if a file at a location is not being used by another process and therefore it is accessible.
        /// </summary>
        public static bool FileIsAccessible(string filename)
        {
            // If the file can be opened for exclusive access it means that the file
            // is no longer locked by another process.
            try
            {
                using (FileStream inputStream = File.Open(filename, FileMode.Open, FileAccess.Read, FileShare.None))
                    return inputStream.Length > 0;
            }
            catch (Exception)
            {
                return false;
            }
        }

        /// <summary>
        /// Locks execution until the file is accessible
        /// </summary>
        /// <param name="filename"></param>
        public static void WaitForFileToBeAccessible(string filename)
        {

            while (!FileIsAccessible(filename)) ;
        }




        /// <summary>
        /// Logs to a file how much time has passed since a certain date.
        /// </summary>
        /// <param name="benchmarkName">Benchmark identifier</param>
        public static void LogTimePassed(this Stopwatch watch, string benchmarkName)
        {
            // watch.Stop();
            if (writeBenchmarks) Log(
              $"Executing {benchmarkName} took {(watch.ElapsedMilliseconds)} milliseconds.");
        }

        public static void Log(string text)
        {
            if (writeLogs) File.AppendAllText(logLocation, $"{DateTime.Now}: {text}\n");
        }

        public static T[] SubArray<T>(this T[] data, int index, int length)
        {
            T[] result = new T[length];
            Array.Copy(data, index, result, 0, length);
            return result;
        }

        const bool writeLogs = true;
        const bool writeBenchmarks = true;
        const string logLocation = "C:\\Users\\natan\\Desktop\\Auto-Using-Git\\AutoUsingCs\\AutoUsing\\logs\\log.txt";
    }

}