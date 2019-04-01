using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using OmniSharp.Extensions.LanguageServer.Protocol.Models;

namespace AutoUsing.Lsp
{
    public class DocumentWalker
    {
        private TextDocumentIdentifier document;
        public DocumentWalker(TextDocumentIdentifier textDocument)
        {
            this.document = textDocument;
        }

        public string GetWordToComplete(Position completionPosition)
        {
            return document.getWordAtPosition(completionPosition);
        }

        /// <summary>
        /// Travels through the document to see what type of completion should appear right now.
        /// </summary>
        /// <param name="vscode.Position">The position at which the user is currently typing</param>
        /// <returns> CompletionType.TYPE if a list of types should show,
        /// CompletionType.EXTENSION if the extension methods of a type should show, and CompletionType.NONE if no completions should appear.</returns>
        public CompletionType GetCompletionType(Position completionPos)
        {
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

            var wordRegex = new Regex(@"([^\s]+)");

            var wordBefore = this.document.getText(this.document.getWordRangeAtPosition(currentPos, wordRegex));
            var lastCharOfWordBefore = wordBefore.slice(-1);

            if (Constants.SyntaxChars.Contains(lastCharOfWordBefore)) return CompletionType.TYPE;
            else if (Constants.ShowSuggestFor.Contains(wordBefore)) return CompletionType.TYPE;
            return CompletionType.NONE;
        }


        /// <summary>
        /// Returns the position before another position in the document
        ///  </summary>
        private Position GetPrev(Position pos)
        {
            return this.document.positionAt(this.document.offsetAt(pos) - 1);
        }

        /// <summary>
        /// Returns the character at a position in the document
        /// </summary>
        /// <param name="vscode.Position"></param>
        private string GetChar(Position pos)
        {
            return this.document.getText(new vscode.Range(pos, pos.translate(0, 1)));
        }



        /// <summary>
        /// Reduces the position of startingPosition (walks back) as long the condition is met.
        /// </summary>
        private Position WalkBackWhile(Position startingPosition, Func<string, bool, Position, bool> condition)
        {

            var currentPos = startingPosition;
            var currentChar = this.GetChar(currentPos);
            var newLineIncoming = false;
            while (condition(currentChar, newLineIncoming, currentPos))
            {
                Tuple<Position, bool> currentPosAndNewLineIncoming = this.GetPrevCheckNewline(currentPos);
                currentPos = currentPosAndNewLineIncoming.Item1;
                newLineIncoming = currentPosAndNewLineIncoming.Item2;
                currentChar = this.GetChar(currentPos);
            }

            return currentPos;
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

        /**
        * Returns the position before another position in the document AND whether or not the next previous character will reach a new line.
        */
        private Tuple<Position, bool> GetPrevCheckNewline(Position pos)
        {
            var newPos = this.GetPrev(pos);
            var newLine = newPos.Line != this.GetPrev(newPos).Line;
            return new Tuple<Position, bool>(newPos, newLine);
        }
    }

    public enum CompletionType
    {
        NONE,
        TYPE,
        EXTENSION
    }

}







//     /**
//      * @param completionPos The position at which the user is currently typing
//      * @returns The hover string of the type that should be extended
//      */
//     public async getMethodCallerHoverString(completionPos: vscode.Position): Promise<string | undefined> {
//         let typePos = await this.getTypeInfoPosition(completionPos);
//         let hoverString = this.getHoverString(typePos);
//         return hoverString;
//     }

//     /**
//      * Travels through the document to see where exactly is the variable that is trying to invoker a method.
//      * This could also be a method call. Examples:
//      * x.F   <--- completionPos is after f, we are looking for x.
//      * x.Foo(bar).b <--- completionPos is after b, we are looking for Foo.
//      * @param completionPos The position in which the user is typing
//      * @returns The position of the method or variable that is trying to invoke a method
//      */
//     private async getTypeInfoPosition(completionPos: vscode.Position): Promise<vscode.Position> {
//         let startOfCaller = this.walkBackWhile(completionPos, isWhitespace);
//         let dotPos = this.walkBackWhile(startOfCaller, char => char !== ".");
//         let endOfWordBefore = this.getPrev(this.walkBackWhile(dotPos, isWhitespace));

//         // If there are brackets we need to check if it's because of a chained method call or because of redundant parentheses
//         if (this.getChar(endOfWordBefore) === ")") {
//             let bracketsThatNeedToBeClosed = 1;
//             let methodCallPos = this.walkBackWhile(this.getPrev(endOfWordBefore), (char) => {
//                 if (char === ")") bracketsThatNeedToBeClosed++;
//                 if (char === "(") bracketsThatNeedToBeClosed--;

//                 return bracketsThatNeedToBeClosed > 0;
//             });

//             // Chained method call
//             if ((await this.getHover(methodCallPos)).length > 0) {
//                 return methodCallPos;
//             }
//             // Redundant parentheses
//             else {
//                 let variablePos = this.walkBackWhile(endOfWordBefore, char => char === ")");
//                 return variablePos;
//             }





//         } else {
//             return endOfWordBefore;
//         }


//     }





//     /**
//      * Reduces the position of startingPosition (walks back) as long the condition is met.
//      */
//     private walkBackWhile(startingPosition: vscode.Position,
//         condition: (char: string, newLineIncoming: boolean, pos: vscode.Position) => boolean): vscode.Position {
//         let currentPos = startingPosition;
//         let currentChar = this.getChar(currentPos);
//         let newLineIncoming = false;
//         while (condition(currentChar, newLineIncoming, currentPos)) {
//             [currentPos, newLineIncoming] = this.getPrevCheckNewline(currentPos);
//             currentChar = this.getChar(currentPos);
//         }

//         return currentPos;
//     }

//     /**
//      * @returns The hover string in a position
//      */
//     private async getHoverString(position: vscode.Position): Promise<string | undefined> {
//         // Get the hover info of the variable from the C# extension
//         let hover = await this.getHover(position);
//         if (hover.length === 0) return undefined;

//         return (<{ language: string; value: string }>hover[0].contents[1]).value;


//     }

//     /**
//      * @returns All hover info in a position
//      */
//     private async getHover(position: vscode.Position): Promise<vscode.Hover[]> {
//         return <vscode.Hover[]>(await vscode.commands.executeCommand("vscode.executeHoverProvider", this.document.uri, position));
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

//     /**
// 	 * @param document The text document to search usings of
// 	 * @returns A list of the namespaces being used in the text document
// 	 */
//     public async getUsings(): Promise<string[]> {
//         let regExp = /^using.*;/gm;
//         let matches = this.document.getText().match(regExp);
//         if (matches === null) return [];
//         return Promise.all(matches.map(async using => {
//             let usingWithSC = using.split(" ")[1];
//             return usingWithSC.substring(0, usingWithSC.length - 1);
//         }));

//     }
// }

// export enum CompletionType {
//     NONE,
//     TYPE,
//     EXTENSION
// }