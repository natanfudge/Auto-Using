
#if DEBUG
#define WRITE_LOGS
#define WRITE_VERBOSE
// #define WRITE_BENCHMARKS
#endif



using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using AutoUsing.Lsp;
using Newtonsoft.Json;
using OmniSharp.Extensions.LanguageServer.Protocol.Models;

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
        /// Returns whether or not a type is an [Attribute]
        /// </summary>
        public static bool IsAttribute(this Type type)
        {
            var currentBaseType = type.BaseType;
            // Travels all the way up the hierarchy tree to check if it inherits from System.Attribute. 
            while (currentBaseType != null)
            {
                if (currentBaseType.FullName == "System.Attribute") return true;
                currentBaseType = currentBaseType.BaseType;
            }
            return false;
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


        public static string LastChar(this string str)
        {
            if (str == "") return "";
            return str[str.Length - 1].ToString();
        }

        public static bool IsOrigin(this Position pos)
        {
            return pos.Character == 0 && pos.Line == 0;
        }

        public static string ReverseToString(this string str)
        {
            return string.Concat(str.Reverse());
        }

        public static string GetNormalPath(this TextDocumentIdentifier doc)
        {
            return doc.Uri.LocalPath.Substring(1);
        }

        public static void AddIfNotContains<T>(this IList<T> list, T element)
        {
            if (!list.Contains(element)) list.Add(element);
        }
        
        public static void Deconstruct<T>(this IList<T> list, out T first, out T second) {
            if(list.Count != 2) throw new IndexOutOfRangeException
                ("Attempt to deconstruct a list that doesn't have 2 elements to 2 parts.");
            first = list[0];
            second = list[1];
        }

         public static void Deconstruct<T>(this IList<T> list, out T first, out T second, out T third) {
            if(list.Count != 3) throw new IndexOutOfRangeException
                ($"Attempt to deconstruct a list '{list.ToIndentedJson()}' that doesn't have 3 elements to 3 parts.");
            first = list[0];
            second = list[1];
            third = list[2];
        }



        /// <summary>
        /// Logs to a file how much time has passed since a certain date.
        /// </summary>
        /// <param name="benchmarkName">Benchmark identifier</param>
        public static void LogTimePassed(this Stopwatch watch, string benchmarkName)
        {
#if WRITE_BENCHMARKS
            Log(
              $"Executing {benchmarkName} took {(watch.ElapsedMilliseconds)} milliseconds.");
#endif

        }

        /// <summary>
        /// Logs text to the log file with the current date attached to it.
        /// </summary>
        public static void Log(string text)
        {
#if WRITE_LOGS

            File.AppendAllText(logLocation, $"{DateTime.Now}: {text}\n");
#endif
        }

        /// <summary>
        /// Logs text to the log file with the current date attached to it only if verbose logging is enabled.
        /// </summary>
        public static void Verbose(string text)
        {
#if WRITE_VERBOSE
            Log(text);
#endif
        }

        /// <summary>
        /// Returns a portion of the array.
        /// </summary>
        /// <param name="arr">The array</param>
        /// <param name="index">The index of the original array the sub array will start from</param>
        /// <param name="length">How many cells, beginning at the index, will be assigned from the original array to the sub array.</param>
        /// <typeparam name="T">The type of the array's elements.</typeparam>
        public static T[] SubArray<T>(this T[] arr, int index, int length)
        {
            T[] result = new T[length];
            Array.Copy(arr, index, result, 0, length);
            return result;
        }


        public static bool IsEmpty<T>(this IEnumerable<T> list){
            return list.Count() == 0;
        }

        public static void RemoveAll<T>(this List<T> list){
            list.RemoveAll(s => true);
        }



        public static void WaitForDebugger()
        {
            // Task.Run(() => Program.SendNotificationToClient(SharedConstants.DebugRequestCommand));
            while (!Debugger.IsAttached) Thread.Sleep(500);
        }




        //HARDCODED
        const string logLocation = "C:/Users/natan/Desktop/Auto-Using-Git/server/AutoUsing/logs/log.txt";
    }

}