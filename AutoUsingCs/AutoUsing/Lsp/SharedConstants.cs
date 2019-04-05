namespace AutoUsing.Lsp
{
    /// <summary>
    /// Constants that are used both here and in the client. They must be the same. At both sides.
    /// </summary>
    public static class SharedConstants
    {
        public const string HANDLE_COMPLETION = "custom/handleCompletion";
        public const string HoverRequestCommand = "custom/hoverRequest";
        // Unicode's `Zero Width Space`. The benefit is that it has a higher unicode that any letter, so things that start with this will sort last.
        public const string SORT_CHEAT = "\u200B";
    }
}