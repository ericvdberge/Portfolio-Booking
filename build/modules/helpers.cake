///////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

public static class BuildHelpers
{
    public static void RunCommand(ICakeContext context, string command, string arguments = "",
        string workingDirectory = null)
    {
        var settings = new ProcessSettings
        {
            Arguments = arguments,
            RedirectStandardOutput = false,
            RedirectStandardError = false
        };

        if (!string.IsNullOrEmpty(workingDirectory))
            settings.WorkingDirectory = workingDirectory;

        var exitCode = context.StartProcess(command, settings);

        if (exitCode != 0)
            throw new Exception($"Command failed with exit code {exitCode}: {command} {arguments}");
    }

    public static string RunCommandWithOutput(ICakeContext context, string command,
        string arguments = "", string workingDirectory = null)
    {
        var settings = new ProcessSettings
        {
            Arguments = arguments,
            RedirectStandardOutput = true,
            RedirectStandardError = true
        };

        if (!string.IsNullOrEmpty(workingDirectory))
            settings.WorkingDirectory = workingDirectory;

        using (var process = context.StartAndReturnProcess(command, settings))
        {
            process.WaitForExit();
            var output = string.Join("\n", process.GetStandardOutput());

            if (process.GetExitCode() != 0)
            {
                var error = string.Join("\n", process.GetStandardError());
                throw new Exception($"Command failed: {command} {arguments}\n{error}");
            }

            return output;
        }
    }

    public static string GetGitCommitHash(ICakeContext context, bool shortHash = true)
    {
        var length = shortHash ? 7 : 40;
        var hash = RunCommandWithOutput(context, "git", $"rev-parse HEAD").Trim();
        return hash.Substring(0, Math.Min(length, hash.Length));
    }

    public static string GetGitBranch(ICakeContext context)
    {
        return RunCommandWithOutput(context, "git", "rev-parse --abbrev-ref HEAD").Trim();
    }

    public static string GenerateDeploymentHash(ICakeContext context)
    {
        var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        var hash = GetGitCommitHash(context, true);
        return $"{timestamp}-{hash}";
    }

    public static void EnsureDirectoryExists(ICakeContext context, string path)
    {
        if (!context.DirectoryExists(path))
            context.CreateDirectory(path);
    }

    public static void CleanDirectory(ICakeContext context, string path)
    {
        if (context.DirectoryExists(path))
            context.CleanDirectory(path);
        else
            EnsureDirectoryExists(context, path);
    }
}
