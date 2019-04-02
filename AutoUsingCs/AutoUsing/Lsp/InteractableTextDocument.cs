using System.Linq;
using System.Text.RegularExpressions;
using System;
using System.Collections.Generic;
using System.Text;
using OmniSharp.Extensions.LanguageServer.Protocol.Models;
using System.Collections;

namespace AutoUsing.Lsp
{
    public class InteractableTextDocument
    {
        private string Text;
        private string[] TextLines;

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
            // var absolutePos = GetAbsolutePosition(pos);
            var line = pos.Line;
            var text = TextLines[line];

            var wordStart = new StringBuilder();
            var wordEnd = new StringBuilder();
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
                if (pos.Line == 0) throw new IndexOutOfRangeException("There is position before (0,0).");
                else
                {
                    var prevLine = pos.Line - 1;
                    var posOfLastCharOfPrevLine = TextLines[prevLine].Length - 1;
                    return new Position(prevLine, posOfLastCharOfPrevLine);
                }
            }

            return new Position(pos.Line, pos.Character - 1);
        }

        public string GetCharAt(Position pos)
        {
            return TextLines[pos.Line][(int)pos.Character].ToString();
        }

        public IEnumerable<string> Match(Regex regex)
        {
            var matches = regex.Matches(Text);
            return matches.Select(match => match.Value);
        }


        // public InteractableTextDocument(TextDocumentIdentifier identifier, FileManager manager)
        public InteractableTextDocument(TextDocumentIdentifier identifier)
        {
            var documentPath = identifier.Uri.ToString();
            // var buffer = manager.GetBuffer(documentPath);
            var buffer = FileManager.GetBuffer(documentPath);
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