namespace AutoUsing
{
    public class Errors
    {
        public const string ProjectFilePathIsRequired = "Project file path is required.",
                            AtLeastOneProjectFileIsRequired = "You need to pass at least one path to a `.csproj` file.",
                            ProjectNameIsRequired = "Project name is required.",

                            InvalidRequestFormat = "Invalid Request Format",
                            UndefinedRequest = "Undefined Request Name",
                            SpecifiedProjectWasNotFound = "Can't find specified project";
    }
}
