using System.Linq;
using System.Collections.Generic;
using System;

namespace TestProg
{
    class Program
    {
        static void Main()
        {

            var loop = new List<int>();
            for (int i = 0; i < 100000 / 5; i++) loop.Add(i);
            var loopStr = loop.Select(num => num < 10 ? num + "____" : num < 100 ? num + "___" : num < 1000 ? num + "__" : num < 10000 ? num + "_" : num.ToString());
            // Console.WriteLine(String.Join(",", loopStr));
            // while (true)
            // {
                // var x = Console.ReadLine();
                var x = 2;
                Console.WriteLine("GOT: " + x + String.Join(",", loopStr));
                var y = Console.ReadLine();
            // }

            // Console.WriteLine("Started");
            // while (true)
            // {
            //     Console.WriteLine("Got " + Console.ReadLine() + "");
            // }
        }
    }
}
