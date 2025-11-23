///////////////////////////////////////////////////////////////////////////////
// DOCKER TASKS
///////////////////////////////////////////////////////////////////////////////

#load "../modules/helpers.cake"

public static class DockerTasks
{
    public static void Login(ICakeContext context, BuildParameters parameters)
    {
        if (string.IsNullOrEmpty(parameters.RegistryPassword))
        {
            context.Information("No registry password provided, skipping docker login");
            return;
        }

        context.Information($"Logging into {parameters.Registry}...");

        // Write password to temp file for secure stdin
        var tempFile = System.IO.Path.GetTempFileName();
        try
        {
            System.IO.File.WriteAllText(tempFile, parameters.RegistryPassword);

            // Use cat/type to pipe password to docker login (cross-platform)
            var isWindows = context.Environment.Platform.Family == PlatformFamily.Windows;
            var catCommand = isWindows ? "type" : "cat";
            var shellCommand = $"{catCommand} \"{tempFile}\" | docker login {parameters.Registry} -u \"{parameters.RegistryUsername}\" --password-stdin";

            var shell = isWindows ? "cmd" : "bash";
            var shellArg = isWindows ? "/c" : "-c";

            var exitCode = context.StartProcess(shell, new ProcessSettings
            {
                Arguments = $"{shellArg} \"{shellCommand}\"",
            });

            if (exitCode != 0)
                throw new Exception("Docker login failed!");

            context.Information("Docker login successful");
        }
        finally
        {
            if (System.IO.File.Exists(tempFile))
                System.IO.File.Delete(tempFile);
        }
    }

    public static void BuildBackendImage(ICakeContext context, BuildParameters parameters)
    {
        context.Information($"Building backend image: {parameters.BackendImageFull}");

        var buildArgs = $"build " +
            $"-t {parameters.BackendImageFull} " +
            $"-f \"{parameters.BackendDirectory}/Booking.Api/Dockerfile\" " +
            $"\"{parameters.BackendDirectory}\"";

        BuildHelpers.RunCommand(context, "docker", buildArgs);

        context.Information($"✓ Backend image built: {parameters.BackendImageFull}");
    }

    public static void BuildFrontendImage(ICakeContext context, BuildParameters parameters)
    {
        context.Information($"Building frontend image: {parameters.FrontendImageFull}");

        var buildArgs = $"build " +
            $"-t {parameters.FrontendImageFull} " +
            $"-f \"{parameters.FrontendDirectory}/Dockerfile\" " +
            $"\"{parameters.FrontendDirectory}\"";

        BuildHelpers.RunCommand(context, "docker", buildArgs);

        context.Information($"✓ Frontend image built: {parameters.FrontendImageFull}");
    }

    public static void PushBackendImage(ICakeContext context, BuildParameters parameters)
    {
        context.Information($"Pushing backend image: {parameters.BackendImageFull}");

        BuildHelpers.RunCommand(context, "docker", $"push {parameters.BackendImageFull}");

        context.Information($"✓ Backend image pushed: {parameters.BackendImageFull}");
    }

    public static void PushFrontendImage(ICakeContext context, BuildParameters parameters)
    {
        context.Information($"Pushing frontend image: {parameters.FrontendImageFull}");

        BuildHelpers.RunCommand(context, "docker", $"push {parameters.FrontendImageFull}");

        context.Information($"✓ Frontend image pushed: {parameters.FrontendImageFull}");
    }

    public static void TagImage(ICakeContext context, string sourceTag, string targetTag)
    {
        context.Information($"Tagging image: {sourceTag} -> {targetTag}");
        BuildHelpers.RunCommand(context, "docker", $"tag {sourceTag} {targetTag}");
    }
}
