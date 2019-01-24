using System.Linq;
using System;
using System.Collections.Generic;
using AutoUsing.DataTypes;
using AutoUsing.Proxy;
using AutoUsing.Models;


namespace AutoUsing
{
    /// <summary>
    /// Specifies the logic for every request
    /// </summary>
    public class Server
    {
        public IOProxy Proxy = new IOProxy();
        private AssemblyScanner Scanner { get; set; }
        private List<Project> Projects = new List<Project>();

        public void Pong(Request req)
        {
            Proxy.WriteData(new SuccessResponse { Body = "pong" });
        }

        public void Error(string error)
        {
            Proxy.WriteData(new ErrorResponse { Body = error });
        }

        public void Listen()
        {
            while (true)
            {
                Proxy.ReadData(new MessageEventArgs { Data = Console.ReadLine() });
            }
        }


        public void SendAllReferences(GetAllReferencesRequest req)
        {
            var projectName = req.projectName;

            if (projectName.IsNullOrEmpty())
            {
                Proxy.WriteData(new ErrorResponse { Body = Errors.ProjectNameIsRequired });
                return;
            }

            // Using C# 7.2 `is expression` to check for null, and assign variable
            if (Projects.Find(o => o.Name == projectName) is Project project)
            {
                Proxy.WriteData(new GetAllReferencesResponse { References = Cache.References.Memory });
            }
            else
            {
                Proxy.WriteData(new ErrorResponse { Body = Errors.SpecifiedProjectWasNotFound });
            }

        }

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
        /**
        {"Command":"addProjects","Arguments":{"projects":["Hello"]}}
         */

        public void AddProjects(AddProjectsRequest req)
        {
            Projects.AddRange(req.Projects.Select(path => new Project(path, watch: true)));
            Proxy.WriteData(new SuccessResponse());
        }


    }
}