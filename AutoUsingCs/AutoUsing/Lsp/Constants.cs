using System.Collections.Generic;
namespace AutoUsing.Lsp
{
    public static class Constants
    {



        // Unicode's `Zero Width Space`. The benefit is that it has a higher unicode that any letter, so things that start with this will sort last.
        public const string SORT_CHEAT = "\u200B";

        public static readonly IEnumerable<string> SyntaxChars = new List<string> { "", "{", "}", "(", ")", "[", "]", "<", ">", "@", ";", "=", "%", "&", "*", "+", ",", "-", "/", ":", "?", "^", "|" };

        // Completions will show after these words because they usually a type comes after them unlike other words which are variable names
        public static readonly IEnumerable<string> ShowSuggestFor = new List<string>{"abstract", "new", "protected", "return", "sizeof", "struct", "using", "volatile", "as",
    "checked", "explicit", "fixed", "goto", "lock", "override", "public", "stackalloc", "unchecked",
    "static", "base", "case", "else", "extern", "if", "params", "readonly", "sealed", "static", "typeof", "unsafe", "virtual", "const", "implicit",
    "internal", "private", "await", "this", "in"
};

        public static readonly Dictionary<string, string> Primitives = new Dictionary<string, string>{
{"bool","Boolean"},{"byte","Byte"},{"sbyte","SByte"},{"char","Char"},{"decimal","Decimal"},{"double","Double"},{"float","Single"},{"int","Int32"},
{"uint","UInt32"},{"long","Int64"},{"ulong","System.UInt64"},{"object","Object"},{"short","Int16"},{"ushort","UInt16"},{"string","String"}
};

    }
}