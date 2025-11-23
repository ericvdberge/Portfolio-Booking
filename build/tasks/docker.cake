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

        var loginArgs = $"login {parameters.Registry} " +
            $"-u {parameters.RegistryUsername} " +
            $"--password-stdin";

        var settings = new ProcessSettings
        {
            Arguments = loginArgs,
            RedirectStandardInput = true,
            RedirectStandardOutput = true
        };

        using (var process = context.StartAndReturnProcess("docker", settings))
        {
            using (var standardInput = process.GetStandardInput())
            {
                standardInput.WriteLine(parameters.RegistryPassword);
            }

            process.WaitForExit();

            if (process.GetExitCode() != 0)
                throw new Exception("Docker login failed!");
        }

        context.Information("Docker login successful");
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
