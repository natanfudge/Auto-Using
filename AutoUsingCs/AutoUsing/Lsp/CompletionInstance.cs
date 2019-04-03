using System.Collections;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using OmniSharp.Extensions.LanguageServer.Protocol.Models;
using static AutoUsing.Lsp.DocumentWalker;
using AutoUsing.Lsp;
using AutoUsing.Utils;
using Newtonsoft.Json.Linq;
using AutoUsing.Analysis.DataTypes;

namespace AutoUsing.Lsp
{

    class CompletionInstance
    {

        // public static async Task<CompletionList> ProvideCompletionItems(CompletionParams request, Server server, FileManager fileManager)
        public static async Task<CompletionList> ProvideCompletionItems(CompletionParams request, Server server)
        {
            // var documentWalker = new DocumentWalker(request.TextDocument,fileManager);
            var documentWalker = new DocumentWalker(request.TextDocument);
            var wordToComplete = documentWalker.GetWordToComplete(request.Position);
            var projectName = VscodeUtil.GetProjectName(request.TextDocument.Uri.LocalPath);
            var completionInstance = new CompletionInstance(documentWalker, projectName, wordToComplete, server);

            return await completionInstance.provideCompletionItems(request);
        }


        public async Task<CompletionList> provideCompletionItems(CompletionParams request)
        {
            var completionType = this.DocumentWalker.GetCompletionType(request.Position);


            if (completionType == CompletionType.NONE)
            {
                return new CompletionList();
            }
            else
            {
                var usings = this.DocumentWalker.GetUsings();
                IEnumerable<TypeCompletion> completionData;

                if (completionType == CompletionType.EXTENSION)
                {

                    // Get the hover string that is provided by omnisharp to get the type information. 
                    var methodCallerHover = await this.DocumentWalker.GetMethodCallerHoverString(request.Position);
                    if (methodCallerHover != null)
                    {
                        // Parse the type information from the string.
                        var methodCallerType = this.ParseType(methodCallerHover);
                        completionData = this.GetExtensionMethods(methodCallerType);
                    }
                    else
                    {
                        Util.Log("Could not find method caller type! Assuming it's just a non-existent type followed by a dot.");
                        completionData = new List<TypeCompletion>();
                    }

                }
                else if (completionType == CompletionType.TYPE)
                {
                    completionData = this.Server.GetAllTypes(this.ProjectName, this.WordToComplete);
                }
                else
                {
                    throw new Exception("this should never happen...");
                }

                return this.completionDataToVscodeCompletions(completionData, usings);
            }
        }

        private DocumentWalker DocumentWalker;
        private string ProjectName;
        private string WordToComplete;
        private Server Server;

        public CompletionInstance(DocumentWalker documentWalker, string projectName, string wordToComplete, Server server)
        {
            DocumentWalker = documentWalker;
            ProjectName = projectName;
            WordToComplete = wordToComplete;
            Server = server;
        }

        /// <summary>
        /// Takes a omnisharp hover string from when you hover over a type, and returns the type that is written in it.
        /// </summary>
        private Type ParseType(string hoverString)
        {
            // Take the relevant part of the hover that contains the type
            const int start = 10;
            var typeStart = hoverString.Substring(start, hoverString.Length);

            // Handle the case it is a generic type
            var generic = false;
            int i;
            for (i = 0; typeStart[i] != ' ' && typeStart[i] != '\n'; i++)
            {
                if (typeStart[i] == '<')
                {
                    generic = true;
                    break;
                }
            }

            var type = typeStart.Substring(0, i);

            string typeClass = type;
            string typeNamespace = null;

            // If it is a full path return the class and namespace
            if (type.Contains("."))
            {
                var classAndNamespace = type.Split(".");
                typeNamespace = string.Join(".", classAndNamespace.SubArray(0, classAndNamespace.Length - 1));
                //TODO: this line makes no sense. 
                typeClass = string.Join(".", classAndNamespace.SubArray(classAndNamespace.Length - 1, classAndNamespace.Length));
                // If it is just a class name return just the class
            }

            // Is an array type
            if (typeClass[typeClass.Length - 1] == ']') typeClass = "Array";

            // Convert primitives to objects. I.E. string => String.
            var typeAsObject = Constants.Primitives[typeClass];
            if (typeAsObject != null) typeClass = typeAsObject;


            if (generic) typeClass += "<>";

            return new Type { Class = typeClass, Namespace = typeNamespace };
        }



        /// <summary>
        /// Get all extension methods of a type
        /// </summary>
        private IEnumerable<TypeCompletion> GetExtensionMethods(Type callerType)
        {
            var hierachies = this.Server.GetAllHierarchies(this.ProjectName);

            // The list of classes that we are looking for extension methods for. Usually this is only one class. 
            var extendedClassHierarchy = hierachies.Find(hierarchy => hierarchy.Class.Equals(callerType.Class));




            if (extendedClassHierarchy.Namespaces.Count == 1)
            {
                var baseclasses = extendedClassHierarchy.Namespaces[0].Parents;
                // Add the class itself to the list of classes that we will get extension methods for.
                var classItselfStr = extendedClassHierarchy.Namespaces[0].Namespace + "." + callerType.Class;
                // Remove generic marker '<>'
                if (classItselfStr[classItselfStr.Length - 1] == '>') classItselfStr = classItselfStr.Substring(0, classItselfStr.Length - 2);
                baseclasses.Append(classItselfStr);


                var result = this.FindExtensionMethodsOfClasses(baseclasses);
                return result;
            }
            else
            {
                throw new Exception("Auto Using does not support ambigous types yet.");
            }
        }

        private IEnumerable<TypeCompletion> FindExtensionMethodsOfClasses(IEnumerable<string> baseclasses)
        {
            // Request extensions from server
            var extensionMethods = this.Server.GetAllExtensionMethods(this.ProjectName, this.WordToComplete);
            // Get the extension methods we need for our base classes
            var extensionMethodsOfBaseClasses = baseclasses.Select(baseclass =>
               extensionMethods.Find(extensionMethod => extensionMethod.ExtendedClass.Equals(baseclass)));
            // Convert the extension method objects into completion objects which we can insert as completions
            var completions = extensionMethodsOfBaseClasses.Where(obj => obj != null)
                .SelectMany(extendedClass => extendedClass.ExtensionMethods
                .Select(extensionMethod => new TypeCompletion(extensionMethod.Name, extensionMethod.Namespaces))
                );
            return completions;
        }

        const int MaxCompletionAmount = 100;

        /// <summary>
        /// Map pure completion data to vscode's CompletionList format
        /// </summary>
        /// <param name="usings">A list of the using directive in the file. All already imported namespaces will be removed from the array.</param>
        private CompletionList completionDataToVscodeCompletions(IEnumerable<TypeCompletion> completions, string[] usings)
        {
            completions = filterOutAlreadyUsing(completions, usings);
            var totalCompletionAmount = completions.Count();
            var completionAmount = Math.Min(totalCompletionAmount, MaxCompletionAmount);
            var takingOnlySomeCompletions = totalCompletionAmount > MaxCompletionAmount;

            var storedCommonCompletions = Server.GetCommonCompletions();
            var commonCompletions = ConvertStoredCompletionsToCompletions(storedCommonCompletions);
            // Take only a limited amount of the completions
            if (takingOnlySomeCompletions) completions = completions.Take(MaxCompletionAmount).Concat(commonCompletions);

            var commonNames = storedCommonCompletions.Select(completion => completion.Label);

            // var vscodeCompletions = new List<CompletionItem>(completionAmount);


            var vscodeCompletions = completions.Select(completion =>
            {
                var name = completion.Name;
                //TODO: optimize by creating the completion list for common names seperately.
                var isCommon = commonNames.Contains(name);

                var thereIsOnlyOneClassWithThatName = completion.Namespaces.Count == 1;

                // We instantly put the using statement only if there is only one option
                var usingStatementEdit = thereIsOnlyOneClassWithThatName ? new List<TextEdit> { usingEdit(completion.Namespaces[0]) } : null;

                var arr = new List<TypeCompletion> { completion };
                var commandArgs = JArray.FromObject(arr);

                var vscodeCompletion = new CompletionItem
                {
                    Label = isCommon ? name : Constants.SORT_CHEAT + name,
                    InsertText = name,
                    FilterText = name,
                    Kind = CompletionItemKind.Reference,
                    // AdditionalTextEdits = usingStatementEdit,
                    CommitCharacters = new List<string> { "." },
                    Detail = string.Join("\n", completion.Namespaces),
                    Command = new Command { Name = HANDLE_COMPLETION, Arguments = commandArgs, Title = "handles completion" }
                };
                if (usingStatementEdit != null) vscodeCompletion.AdditionalTextEdits = usingStatementEdit;
                return vscodeCompletion;
            });


            return new CompletionList(vscodeCompletions, takingOnlySomeCompletions);

        }

        const string HANDLE_COMPLETION = "HandleCompletion";

        //TODO: this might not be right...
        readonly Func<string, TextEdit> usingEdit = (string @namespace) => new TextEdit { Range = new Range(new Position(0, 0), new Position(0, 1)), NewText = $"using {@namespace};\n" };

        /// <summary>
        /// Removes all namespaces that already have a using statement
        /// </summary>
        /// <param name="completions"></param>
        /// <param name="usings"></param>
        /// <returns>The length of the remaining array</returns>
        private static IEnumerable<TypeCompletion> filterOutAlreadyUsing(IEnumerable<TypeCompletion> completions, string[] usings)
        {
            //TODO: this might be slow now. just reduce the amount of completions we process in the first place to 100.
            Array.Sort(usings);

            return completions.Where(completion => completion.Namespaces.Any(@namespace => Array.BinarySearch<string>(usings, @namespace) < 0));
        }





        private static IEnumerable<TypeCompletion> ConvertStoredCompletionsToCompletions(IEnumerable<StoredCompletion> commonNames)
        {
            var completions = new List<TypeCompletion>();
            foreach (var commonName in commonNames)
            {
                var refWithSameName = completions.Find(completion => completion.Name == commonName.Label);
                // If one exists with the same name we combine their namespaces 
                if (refWithSameName != null) refWithSameName.Namespaces.Append(commonName.Namespace);
                else completions.Append(new TypeCompletion { Name = commonName.Label, Namespaces = new List<string> { commonName.Namespace } });

            }
            return completions;
        }

    }

}

