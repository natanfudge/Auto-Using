using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Threading.Tasks;
using AutoUsing.Analysis.Cache;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace AutoUsingTest
{
    [TestClass]
    public class CompressionTest
    {
        const int num = 100000;
        [TestMethod]
        public async Task Utf16BigStringTest()
        {
            //200KB
            string str = new string('x', num);
            await Task.Delay(2000);
            var x = 2;
        }

        public async Task Utf16BigListTest()
        {
            List<string> list = new List<string>(num);
                for(int i = 0; i < num; i++)
            {
                list.Add("x");
            }
            //string str = new string('x', 100000);
            await Task.Delay(2000);
            var x = 2;
        }

        [TestMethod]
        public async Task Utf8Test()
        {
            //100KB
            var str = GetBigString();
            GC.Collect();
            await Task.Delay(2000);
            var x = 2;
        }

        private byte[] GetBigString()
        {
            string str = new string('x', num);
            var big = Encoding.UTF8.GetBytes(str);
            return big;
        }

        [TestMethod]
        public async Task Utf8ListTest()
        {
            //480KB
            var str = GetBigStringList();
            GC.Collect();
            await Task.Delay(2000);
            var x = 2;
        }

        private List<byte[]> GetBigStringList()
        {
            var div = 10;
            var list = new List<byte[]>(num / div);
            for(int i = 0; i < num / div; i++)
            {
                list.Add(Encoding.UTF8.GetBytes(new string('x', div)));
            }
            //string str = new string('x', num);
            //var big = (str);
            return list;
        }

        [TestMethod]
        public async Task StringCollectionTest()
        {
            // 610KB
            var str = GetBigStringCollection();
            GC.Collect();
            await Task.Delay(2000);
            var x = 2;
        }

        private StringCollection GetBigStringCollection()
        {
            var div = 10;
            var list = new StringCollection();
            for (int i = 0; i < num / div; i++)
            {
                list.Add(new string('x', div));
            }
            //string str = new string('x', num);
            //var big = (str);
            return list;
        }

        [TestMethod]
        public async Task ByteArrArrTest()
        {
            var str = GetByteArrArr();
            GC.Collect();
            await Task.Delay(2000);
            var x = 2;
        }


        private byte[][] GetByteArrArr()
        {
            var div = 10;
            var list = new byte[num / div][];
            for (int i = 0; i < num / div; i++)
            {
                list[i] = (Encoding.UTF8.GetBytes(new string('x', div)));
            }

            return list;
        }

    }
}