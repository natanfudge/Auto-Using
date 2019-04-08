namespace AutoUsing
{
    public class Errors
    {
        public const string ProjectFilePathIsRequired = "Project file path is required.",
                            AtLeastOneProjectFileIsRequired = "You need to pass at least one path to a `.csproj` file.",
                            ProjectNameIsRequired = "Project name is required.",
                            NonExistentProject = "No project exists at the path.",
                            NotAProjectFile = "File at path is not a .csproj file.",

                            InvalidRequestFormat = "Invalid Request Format.",
                            UndefinedRequest = "Undefined Request Name.",
                            SpecifiedProjectWasNotFound = "Can't find specified project.";
    }
}
