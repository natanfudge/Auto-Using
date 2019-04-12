using System.Linq;
using System.Text.RegularExpressions;
using System;
using System.Collections.Generic;
using System.Text;
using OmniSharp.Extensions.LanguageServer.Protocol.Models;
using System.Collections;
using AutoUsing.Utils;

namespace AutoUsing.Lsp
{
    public class InteractableTextDocument
    {
        private string Text;
        private string[] TextLines;

        public string Path { get; set; }

        /// <summary>
        /// Gets the absolute numeric position in a text file by line and column.
        /// </summary>
        // private int GetAbsolutePosition(Position pos)
        // {
        //     var position = 0;
        //     for (var i = 0; i < pos.Line; i++)
        //     {
        //         position = Text.IndexOf('\n', position) + 1;
        //     }
        //     return (int)(position + pos.Character);
        // }
        public string GetWordAtPosition(Position pos)
        {

            var line = pos.Line;
            var text = TextLines[line];
            // text == "" can cause an out of bounds exception
            if (text == "") return "";

            var wordStart = new StringBuilder();
            var wordEnd = new StringBuilder();

            var c = text[(int)pos.Character];

            // Get all chars BEFORE the position and at the position until there is a space
            for (var i = (int)pos.Character; i >= 0 && !string.IsNullOrWhiteSpace(text[i].ToString()); i--) wordStart.Append(text[i]);
            // Get all chars AFTER the position until there is a space
            for (var i = (int)pos.Character + 1; i < text.Length && !string.IsNullOrWhiteSpace(text[i].ToString()); i++) wordEnd.Append(text[i]);

            var start = string.Concat(wordStart.ToString().Reverse());
            var word = string.Concat(start.Concat(wordEnd.ToString()));

            //  .Append(wordEnd.ToString());

            return word;

        }

        public Position GetPreviousPosition(Position pos)
        {
            if (pos.Character == 0)
            {
                if (pos.Line == 0) throw new IndexOutOfRangeException("Attempt to get the position before (0,0).");
                else
                {
                    var prevLine = pos.Line - 1;
                    var prevLineLength =  TextLines[prevLine].Length;

                    // Skip blank lines
                    while(prevLineLength == 0){
                        // if(prevLine == 0) throw new IndexOutOfRangeException("Attempt to get the position before (0,0).");
                        prevLine--;
                        prevLineLength = TextLines[prevLine].Length;
                    }
                    
                    var posOfLastCharOfPrevLine = prevLineLength- 1;
                    return new Position(prevLine, posOfLastCharOfPrevLine);
                }
            }

            return new Position(pos.Line, pos.Character - 1);
        }

        public string GetCharAt(Position pos)
        {
            var line = TextLines[pos.Line];
            if (pos.Character == line.Length) return "";
            return line[(int)pos.Character].ToString();
            // if (pos.Character == 0) return "";

            // var str = TextLines[pos.Line];
            // var length = str.Length;

        }

        public IEnumerable<string> Matches(Regex regex)
        {
            // regex.Options = new RegexOptions{}
            var matches = regex.Matches(Text);
            return matches.Select(match => match.Value);
        }


        // public InteractableTextDocument(TextDocumentIdentifier identifier, FileManager manager)
        public InteractableTextDocument(TextDocumentIdentifier identifier)
        {
            Path = identifier.GetNormalPath();
            var buffer = FileManager.GetBuffer(Path);
            Text = buffer.ToString();
            TextLines = buffer.ToString().Split("\n");

            //     CompletionParams request = null;

            //     var position = GetPosition(buffer.ToString(),
            //    (int)request.Position.Line,
            //    (int)request.Position.Character);

            // Buffer.
        }

        // public void x(Buffer y)
        // {

        // }

    }
}