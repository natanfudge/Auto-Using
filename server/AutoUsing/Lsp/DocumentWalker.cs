

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AutoUsing.Utils;
using OmniSharp.Extensions.Embedded.MediatR;
using OmniSharp.Extensions.LanguageServer.Protocol.Models;
using OmniSharp.Extensions.LanguageServer.Protocol.Server;

namespace AutoUsing.Lsp
{

    public class DocumentWalker
    {
        private InteractableTextDocument Document;
        private ILanguageServer Server;
        // public DocumentWalker(TextDocumentIdentifier textDocument, FileManager manager)
        public DocumentWalker(TextDocumentIdentifier textDocument, ILanguageServer server)
        {
            // this.document = new InteractableTextDocument(textDocument, manager);
            this.Document = new InteractableTextDocument(textDocument);
            this.Server = server;
        }

        /// <summary>
        /// Returns the string the user has typed already.
        /// </summary>
        public string GetWordToComplete(Position completionPosition)
        {
            return ParseWordBefore(completionPosition);

        }

        /// <summary>
        /// Returns the word before a certain position.  Considers stuff like brackets and semicolons as not part of words.
        /// </summary>
        /// <param name="wordPosition"></param>
        /// <returns></returns>
        public string ParseWordBefore(Position wordPosition)
        {
            if(wordPosition.IsOrigin()) return "";
            var word = new StringBuilder();
            WalkBackWhile(GetPrev(wordPosition), (c,newLine,pos) =>
            {
                // Once we hit something like a space or a semicolon it means the word has ended.
                if (string.IsNullOrWhiteSpace(c) || c == "." || Constants.SyntaxChars.Contains(c) || pos.IsOrigin()) return false;
                word.Append(c);
                return true;
            });

            return word.ToString().ReverseToString();
        }

        /// <summary>
        /// Travels through the document to see what type of completion should appear right now.
        /// </summary>
        /// <param name="vscode.Position">The position at which the user is currently typing</param>
        /// <returns> CompletionType.TYPE if a list of types should show,
        /// CompletionType.EXTENSION if the extension methods of a type should show, and CompletionType.NONE if no completions should appear.</returns>
        public CompletionType GetCompletionType(Position completionPos)
        {
            if (completionPos.IsOrigin()) return CompletionType.NONE;
            var currentPos = this.GetPrev(completionPos);

            var currentChar = this.GetChar(currentPos);

            // Travel to before this word
            while (!string.IsNullOrWhiteSpace(currentChar))
            {
                if (currentChar == ".")
                {
                    return CompletionType.EXTENSION;
                }
                if (Constants.SyntaxChars.Contains(currentChar)) return CompletionType.TYPE;
                currentPos = this.GetPrev(currentPos);
                currentChar = this.GetChar(currentPos);
            }

            currentPos = this.WalkBackWhile(currentPos, this.ShouldKeepSearchingForCompletionIdentifier);
            if (this.GetChar(currentPos) == ".") return CompletionType.EXTENSION;

            // var wordRegex = new Regex(@"([^\s]+)");

            // Take a step forwards to make it right before the previous word
            currentPos = new Position(currentPos.Line, currentPos.Character + 1);
            var wordBefore = ParseWordBefore(currentPos);
            var lastCharOfWordBefore = wordBefore.LastChar();

            if (Constants.SyntaxChars.Contains(lastCharOfWordBefore)) return CompletionType.TYPE;
            else if (Constants.ShowSuggestFor.Contains(wordBefore)) return CompletionType.TYPE;
            return CompletionType.NONE;
        }

        // private bool ShouldShowSuggestFor(string word){
        //     var bracketPos = wor
        // }


        /// <summary>
        /// Returns the position before another position in the document
        ///  </summary>
        private Position GetPrev(Position pos)
        {
            return this.Document.GetPreviousPosition(pos);
        }

        /// <summary>
        /// Returns the character at a position in the document
        /// </summary>
        /// <param name="vscode.Position"></param>
        private string GetChar(Position pos)
        {
            return this.Document.GetCharAt(pos);
        }



        /// <summary>
        /// Reduces the position of startingPosition (walks back) as long the condition is met.
        /// The condition takes 3 arguments the method caller can use:
        ///  The char at the current position, Whether or not this is the last char before a new line, The current position.
        /// </summary>
        private Position WalkBackWhile(Position startingPosition, Func<string, bool, Position, bool> condition)
        {

            var currentPos = startingPosition;
            var currentChar = this.GetChar(currentPos);
            var newLineIncoming = false;
            while (condition(currentChar, newLineIncoming, currentPos))
            {
                (currentPos, newLineIncoming) = this.GetPrevCheckNewline(currentPos);
                currentChar = this.GetChar(currentPos);
            }

            return currentPos;
        }

        /// <summary>
        /// Reduces the position of startingPosition (walks back) as long the condition is met.
        /// The condition takes 1 argument the method caller can use:
        ///  The char at the current position
        /// </summary>

        private Position WalkBackWhile(Position startingPosition, Func<string, bool> condition)
        {
            return WalkBackWhile(startingPosition, (currentChar, newLine, pos) => condition(currentChar));
        }

        private bool ShouldKeepSearchingForCompletionIdentifier(string currentChar, bool newLineIncoming, Position currentPos)
        {
            // Look one char further back so the walkBackWhile function will return the line AFTER the comment line in case a comment was found.
            var nextPos = this.GetPrev(currentPos);
            // let nextChar = this.getChar(nextPos);

            // Ignore comment lines
            if (newLineIncoming)
            {
                var slashLastPos = false;
                var shouldKeepSearching = true;
                this.WalkBackWhile(nextPos, (c, newLine, pos) =>
                {
                    if (c == "/")
                    {
                        if (slashLastPos)
                        {
                            // Comment line
                            shouldKeepSearching = false;
                            return false;
                        }
                        else
                        {
                            slashLastPos = true;
                        }
                    }
                    else
                    {
                        slashLastPos = false;
                    }
                    // Continue while on the same line
                    return !newLine;
                });

                return shouldKeepSearching;
            }
            return string.IsNullOrWhiteSpace(currentChar);
        }


        /// <summary>
        /// Returns the position before another position in the document AND whether or not the next previous character will reach a new line.
        /// </summary>
        private (Position previousPosition, bool newLineIncoming) GetPrevCheckNewline(Position pos)
        {
            var newPos = this.GetPrev(pos);
            var newLine = newPos.Line != this.GetPrev(newPos).Line;
            return (newPos, newLine);
        }

        /// <summary>
        /// Returns a list of the namespaces being used in the text document
        /// </summary>
        /// <returns></returns>
        public string[] GetUsings()
        {
            var regExp = new Regex(@"^using.*;", RegexOptions.Multiline);
            var matches = this.Document.Matches(regExp);
            if (matches == null) return null;
            var usings = matches.Select(match =>
            {
                // Get namespace
                var namespaceWithSemicolon = match.Split(" ")[1];
                // Remove semicolon
                return namespaceWithSemicolon.Remove(namespaceWithSemicolon.Length - 1);
            });

            return usings.ToArray();

        }






        /// <summary>
        /// Travels through the document to see where exactly is the variable that is trying to invoker a method.
        /// This could also be a method call. Examples:
        /// x.F   <==== completionPos is after f, we are looking for x.
        ///  x.Foo(bar).b <==== completionPos is after b, we are looking for Foo.
        /// </summary>
        /// <param name="completionPos"> The position in which the user is typing</param>
        /// <returns>The position of the method or variable that is trying to invoke a method</returns>
        private async Task<Position> GetTypeInfoPosition(Position completionPos)
        {
            var startOfCaller = this.WalkBackWhile(completionPos, string.IsNullOrWhiteSpace);
            var dotPos = this.WalkBackWhile(startOfCaller, c => c != ".");
            var endOfWordBefore = this.GetPrev(this.WalkBackWhile(dotPos, string.IsNullOrWhiteSpace));

            // If there are brackets we need to check if it's because of a chained method call or because of redundant parentheses
            if (this.GetChar(endOfWordBefore) == ")")
            {
                var bracketsThatNeedToBeClosed = 1;
                var methodCallPos = this.WalkBackWhile(this.GetPrev(endOfWordBefore), (c) =>
                {
                    if (c == ")") bracketsThatNeedToBeClosed++;
                    if (c == "(") bracketsThatNeedToBeClosed--;

                    return bracketsThatNeedToBeClosed > 0;
                });

                // Chained method call. In this case get the type of the method
                if ((await this.GetHoverString(methodCallPos)) != null)
                {
                    return methodCallPos;
                }
                // Redundant parentheses. In this case we get the position of the variable who invoked the '.'
                else
                {
                    var variablePos = this.WalkBackWhile(endOfWordBefore, c => c == ")");
                    return variablePos;
                }
            }
            else
            {
                return endOfWordBefore;
            }
        }


        /// Returns the hover string of the type that should be extended
        /// </summary>
        /// <param name="completionPos">The position at which the user is currently typing</param>
        public async Task<string> GetMethodCallerHoverString(Position completionPos)
        {
            var typePos = await this.GetTypeInfoPosition(completionPos);
            var hoverString = await this.GetHoverString(typePos);
            return hoverString;
        }


        /// <summary>
        /// Returns the actual string of the hover information in a position. Will return null if no hover information is provided by the editor.
        /// </summary>
        private async Task<string> GetHoverString(Position position)
        {
            var request = new HoverRequest { Pos = position, FilePath = Document.Path };
            string response = await Server.SendRequest<HoverRequest, string>(SharedConstants.HoverRequestCommand, request);
            return response;
        }


        // /// <summary>
        // /// Returns All hover info in a position that is provided by vscode and its extensions
        // /// </summary>
        // /// <param name="vscode.Position"></param>
        // private async Task<List<Hover>> GetHover(Position position)
        // {
        //     var request = new HoverRequest { Pos = position, FilePath = Document.Path };
        //     List<Hover> response = await Server.SendRequest<HoverRequest, string>(SharedConstants.HoverRequestCommand, request);
        //     return response;
        //     // return new List<Hover>();
        //     // return <vscode.Hover[]>(await vscode.commands.executeCommand("vscode.executeHoverProvider", this.document.uri, position));
        // }



        private class HoverRequest : IRequest
        {
            public Position Pos { get; set; }
            public string FilePath { get; set; }
        }

        public enum CompletionType
        {
            NONE,
            TYPE,
            EXTENSION
        }

    }
}















//         } else {
//             return endOfWordBefore;
//         }


//     }



















//     public async filterByTypedWord(completionPosition: vscode.Position, completions: Completion[]): Promise<Completion[]> {
//         let wordToComplete = this.getWordToComplete(completionPosition);
//         // let range = this.document.getWordRangeAtPosition(completionPosition);
//         // if (range) {
//         //     wordToComplete = this.document.getText(newLine vscode.Range(range.start, completionPosition)).toLowerCase();
//         // }
//         let matcher = (f: Completion) => f.name.toLowerCase().indexOf(wordToComplete) > -1;
//         let found = completions.filter(matcher);
//         return found;
//     }


// }

// export enum CompletionType {
//     NONE,
//     TYPE,
//     EXTENSION
// }