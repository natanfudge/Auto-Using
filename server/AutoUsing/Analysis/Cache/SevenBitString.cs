using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AutoUsing.Analysis.Cache
{
    public class SevenBitString
    {
        public  static byte[] Compress(string str)
        {
            return Encoding.ASCII.GetBytes(str);
        }

        public static string Uncompress(byte[] sevenBitStrings)
        {
            return Encoding.ASCII.GetString(sevenBitStrings);
        }
    }
}