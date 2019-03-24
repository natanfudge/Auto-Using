using System.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using AutoUsing.Analysis;
using AutoUsing.Analysis.Cache;
using AutoUsing.Models;
using AutoUsing.Proxy;
using FireSharp.Extensions;
using AutoUsing.Analysis.DataTypes;

namespace AutoUsing
{
    /// <summary>
    /// Specifies the logic for every request
    /// </summary>
    public class Server
    {
        public IOProxy Proxy = new IOProxy();
        private List<Project> Projects = new List<Project>();

        public Response Pong(Request req)
        {
            return new PingResponse();
        }

        public Response Error(string error)
        {
            return new ErrorResponse { Body = error };
        }

        public void WriteError(string error)
        {
            Proxy.WriteData(Error(error));
        }

        public void Listen()
        {
            //            Task.Run(() =>
            {
                while (true)
                {
                    Proxy.ReadData(new MessageEventArgs { Data = Console.ReadLine() });
                }
            }
            //            );
        }


        /// <summary>
        /// Returns the list of types in the .NET base class library + the types in the libraries of the
        /// requested projected + the types in the requested project, as long as they start with the
        /// "WordToComplete" field in the request
        /// </summary>
        public Response GetAllReferences(GetCompletionDataRequest req)
        {
            Response errorResponse;
            var project = FindProject(req.ProjectName, out errorResponse);
            if (project == null) return errorResponse;

            var referenceInfo = GlobalCache.Caches.Types.Get();
            referenceInfo.AddRange(project.Caches.Types.Get());
            var refinedReferenceData = FilterUnnecessaryData(CompletionCaches.ToCompletionFormat(referenceInfo),
            req.WordToComplete, (reference) => reference.Name);

            return new GetAllReferencesResponse(refinedReferenceData);

        }

        /// <summary>
        /// Removes completion data that is unneeded because the user has already filered them.
        /// </summary>
        /// <param name="dataList">Completion data</param>
        /// <param name="wordToComplete">The characters the user has type so far</param>
        /// <param name="identifierOfElements">A function that returns what is shown as the actual completion for a specific data element</param>
        /// <typeparam name="T">The type of completion data</typeparam>
        /// <returns>The data list filitered</returns>
        private static List<T> FilterUnnecessaryData<T>(List<T> dataList, string wordToComplete, Func<T, string> identifierOfElements)
        {
            return dataList.Where(element => identifierOfElements(element).ToLower().Contains(wordToComplete.ToLower())).ToList();
        }


        public Response GetAllExtensionMethods(GetCompletionDataRequest req)
        {
            Response errorResponse;
            var project = FindProject(req.ProjectName, out errorResponse);
            if (project == null) return errorResponse;

            var extensionInfo = GlobalCache.Caches.Extensions.Get();
            extensionInfo.AddRange(project.Caches.Extensions.Get());
            var refinedExtensionData = CompletionCaches.ToCompletionFormat(extensionInfo);

            // Remove all extension methods that have been filtered by the word to complete
            refinedExtensionData = refinedExtensionData
            .Select(extendedClass => new ExtensionClass(extendedClass.ExtendedClass,extendedClass.ExtensionMethods
            .Where(extensionMethod => extensionMethod.Name.Contains(req.WordToComplete)).ToList()))
            .Where(extendedClass => extendedClass.ExtensionMethods.Count > 0).ToList();
            //  req.WordToComplete, (reference) => reference.ExtendedClass);

            return new GetAllExtensionMethodsResponse(refinedExtensionData);

        }

        public Response GetAllHiearchies(ProjectSpecificRequest req)
        {
            Response errorResponse;
            var project = FindProject(req.ProjectName, out errorResponse);
            if (project == null) return errorResponse;

            var hiearchyInfo = GlobalCache.Caches.Hierachies.Get();
            hiearchyInfo.AddRange(project.Caches.Hierachies.Get());
            return new GetAllHierachiesResponse( CompletionCaches.ToCompletionFormat(hiearchyInfo));
        }

        private Project FindProject(string projectName, out Response errorResponse)
        {
            if (projectName.IsNullOrEmpty())
            {
                errorResponse = new ErrorResponse { Body = Errors.ProjectNameIsRequired };
            }

            // Using C# 7.2 `is expression` to check for null, and assign variable
            if (Projects.Find(o => o.Name == projectName) is Project project)
            {
                errorResponse = null;
                return project;
            }
            else
            {
                errorResponse = new ErrorResponse
                {
                    Body = Errors.SpecifiedProjectWasNotFound +
                                $"\nRequested project {projectName} is not in this list: {String.Join(",", Projects.Select(proj => proj.Name))}"
                };
            }

            return null;

        }


        //TODO
        public void AddProject(Request req)
        {
            // var projectFilePath = req.Arguments;

            // if (!projectFilePath.IsNullOrEmpty())
            // {
            //     Projects.Add(new Project(projectFilePath, watch: true));
            //     return;
            // }

            // Proxy.WriteData(new ErrorResponse { Body = Errors.ProjectFilePathIsRequired });
        }

        //TODO
        public void RemoveProject(Request req)
        {
            // var projectName = req.Arguments;

            // if (!projectName.IsNullOrEmpty())
            // {
            //     // One line torture :D
            //     foreach (var project in Projects.Select(o => { if (o.Name != projectName) return null; o.Dispose(); return o; }))
            //     {
            //         Projects.Remove(project);
            //     }

            //     return;
            // }

            // Proxy.WriteData(new ErrorResponse { Body = Errors.ProjectNameIsRequired });
        }

        public void AddCmdArgProjects(string[] projects)
        {
            foreach (var path in projects)
            {
                Projects.Add(new Project(path, watch: true));
            }
        }

        /// <summary>
        /// Adds .NET projects for the server to watch over and collect assembly info about.
        /// </summary>
        public Response AddProjects(AddProjectsRequest req)
        {
            if (req.Projects.Any(path => !File.Exists(path)))
            {
                return new ErrorResponse { Body = Errors.NonExistentProject };
            }

            const string csproj = ".csproj";

            if (req.Projects.Any(path => Path.GetExtension(path) != csproj))
            {
                return new ErrorResponse { Body = Errors.NonExistentProject };
            }

            Projects.AddRange(req.Projects.Select(path => new Project(path, watch: true)));
            return new EmptyResponse();
        }
    }
}