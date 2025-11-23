///////////////////////////////////////////////////////////////////////////////
// AZURE DEPLOYMENT TASKS
///////////////////////////////////////////////////////////////////////////////

#load "../modules/helpers.cake"

public static class AzureTasks
{
    public static void Login(ICakeContext context, BuildParameters parameters)
    {
        if (string.IsNullOrEmpty(parameters.AzureClientId))
        {
            context.Information("Azure credentials not provided, skipping login");
            return;
        }

        context.Information("Logging into Azure...");

        var loginArgs = $"login " +
            $"--service-principal " +
            $"-u {parameters.AzureClientId} " +
            $"-t {parameters.AzureTenantId} " +
            $"--federated-token \"$(cat $AZURE_FEDERATED_TOKEN_FILE)\"";

        BuildHelpers.RunCommand(context, "az", loginArgs);

        BuildHelpers.RunCommand(context, "az", $"account set --subscription {parameters.AzureSubscriptionId}");

        context.Information("✓ Azure login successful");
    }

    public static bool CheckInfrastructureExists(ICakeContext context, BuildParameters parameters)
    {
        context.Information("Checking if infrastructure exists...");

        try
        {
            var frontendExists = BuildHelpers.RunCommandWithOutput(context, "az",
                $"containerapp show " +
                $"--name {parameters.NamePrefix}-frontend " +
                $"--resource-group {parameters.ResourceGroup} " +
                $"--query name -o tsv");

            var backendExists = BuildHelpers.RunCommandWithOutput(context, "az",
                $"containerapp show " +
                $"--name {parameters.NamePrefix}-backend " +
                $"--resource-group {parameters.ResourceGroup} " +
                $"--query name -o tsv");

            var exists = !string.IsNullOrWhiteSpace(frontendExists) && !string.IsNullOrWhiteSpace(backendExists);

            context.Information(exists
                ? "✓ Infrastructure exists, will deploy revision only"
                : "Infrastructure does not exist, will run full deployment");

            return exists;
        }
        catch
        {
            context.Information("Infrastructure does not exist, will run full deployment");
            return false;
        }
    }

    public static void RemoveExistingPRRevisions(ICakeContext context, BuildParameters parameters)
    {
        if (parameters.EnvironmentType != "preview")
            return;

        context.Information($"Removing existing revisions for PR {parameters.PRNumber}...");

        var revisionLabel = parameters.RevisionLabel;

        // Remove frontend revision
        RemoveRevisionWithLabel(context, parameters, "frontend", revisionLabel);

        // Remove backend revision
        RemoveRevisionWithLabel(context, parameters, "backend", revisionLabel);

        context.Information("✓ Existing PR revisions removed");
    }

    private static void RemoveRevisionWithLabel(ICakeContext context, BuildParameters parameters,
        string appType, string label)
    {
        context.Information($"Checking for {appType} revision with label '{label}'...");

        try
        {
            var revisionName = BuildHelpers.RunCommandWithOutput(context, "az",
                $"containerapp ingress traffic show " +
                $"--resource-group {parameters.ResourceGroup} " +
                $"--name {parameters.NamePrefix}-{appType} " +
                $"--query \"[?label=='{label}'].revisionName | [0]\" -o tsv");

            if (!string.IsNullOrWhiteSpace(revisionName) && revisionName != "null")
            {
                context.Information($"Found {appType} revision: {revisionName}");

                // Remove label
                BuildHelpers.RunCommand(context, "az",
                    $"containerapp revision label remove " +
                    $"--resource-group {parameters.ResourceGroup} " +
                    $"--name {parameters.NamePrefix}-{appType} " +
                    $"--label {label} " +
                    $"--yes");

                // Deactivate revision
                BuildHelpers.RunCommand(context, "az",
                    $"containerapp revision deactivate " +
                    $"--resource-group {parameters.ResourceGroup} " +
                    $"--name {parameters.NamePrefix}-{appType} " +
                    $"--revision {revisionName}");

                context.Information($"✓ Removed {appType} revision: {revisionName}");
            }
            else
            {
                context.Information($"No {appType} revision found with label '{label}'");
            }
        }
        catch (Exception ex)
        {
            context.Warning($"Could not remove {appType} revision: {ex.Message}");
        }
    }

    public static string DeployInfrastructure(ICakeContext context, BuildParameters parameters)
    {
        context.Information("Deploying Azure infrastructure...");

        var deploymentHash = BuildHelpers.GenerateDeploymentHash(context);
        var deploymentName = parameters.EnvironmentType == "production"
            ? $"production-{deploymentHash}"
            : $"pr-{parameters.PRNumber}-{deploymentHash}";

        var bicepFile = $"{parameters.InfrastructureDirectory}/azure-setup.bicep";

        var deployArgs = $"deployment group create " +
            $"--resource-group {parameters.ResourceGroup} " +
            $"--name {deploymentName} " +
            $"--template-file \"{bicepFile}\" " +
            $"--parameters namePrefix={parameters.NamePrefix} " +
            $"--parameters location={parameters.Location} " +
            $"--parameters environmentType={parameters.EnvironmentType} " +
            $"--parameters prNumber=\"{parameters.PRNumber}\" " +
            $"--parameters backendImage=\"{parameters.BackendImageFull}\" " +
            $"--parameters frontendImage=\"{parameters.FrontendImageFull}\" " +
            $"--parameters databasePassword=\"{parameters.DbPassword}\" " +
            $"--parameters deploymentHash=\"{deploymentHash}\"";

        BuildHelpers.RunCommand(context, "az", deployArgs);

        context.Information($"✓ Infrastructure deployed: {deploymentName}");
        return deploymentHash;
    }

    public static string DeployRevision(ICakeContext context, BuildParameters parameters)
    {
        context.Information("Deploying new container revision...");

        var deploymentHash = BuildHelpers.GenerateDeploymentHash(context);

        // Deploy backend revision
        var backendRevision = DeployBackendRevision(context, parameters, deploymentHash);

        // Deploy frontend revision
        var frontendRevision = DeployFrontendRevision(context, parameters, deploymentHash);

        context.Information($"✓ Revisions deployed - Backend: {backendRevision}, Frontend: {frontendRevision}");
        return deploymentHash;
    }

    private static string DeployBackendRevision(ICakeContext context, BuildParameters parameters,
        string revisionSuffix)
    {
        context.Information("Deploying backend revision...");

        var updateArgs = $"containerapp update " +
            $"--name {parameters.NamePrefix}-backend " +
            $"--resource-group {parameters.ResourceGroup} " +
            $"--image \"{parameters.BackendImageFull}\" " +
            $"--revision-suffix \"{revisionSuffix}\" " +
            $"--set-env-vars \"ASPNETCORE_ENVIRONMENT=Production\" " +
            $"--output json";

        var output = BuildHelpers.RunCommandWithOutput(context, "az", updateArgs);

        // Parse JSON to get revision name - simplified version
        var revisionName = System.Text.RegularExpressions.Regex.Match(output,
            @"""latestRevisionName""\s*:\s*""([^""]+)""").Groups[1].Value;

        context.Information($"✓ Backend revision created: {revisionName}");
        return revisionName;
    }

    private static string DeployFrontendRevision(ICakeContext context, BuildParameters parameters,
        string revisionSuffix)
    {
        context.Information("Deploying frontend revision...");

        // Get backend FQDN
        var backendFqdn = BuildHelpers.RunCommandWithOutput(context, "az",
            $"containerapp show " +
            $"--name {parameters.NamePrefix}-backend " +
            $"--resource-group {parameters.ResourceGroup} " +
            $"--query \"properties.configuration.ingress.fqdn\" -o tsv").Trim();

        // Calculate API URL based on environment
        string apiUrl;
        if (parameters.EnvironmentType == "preview")
        {
            var backendDomain = backendFqdn.Substring(backendFqdn.IndexOf('.') + 1);
            apiUrl = $"https://{parameters.NamePrefix}-backend---{parameters.RevisionLabel}.{backendDomain}";
        }
        else
        {
            apiUrl = $"https://{backendFqdn}";
        }

        var updateArgs = $"containerapp update " +
            $"--name {parameters.NamePrefix}-frontend " +
            $"--resource-group {parameters.ResourceGroup} " +
            $"--image \"{parameters.FrontendImageFull}\" " +
            $"--revision-suffix \"{revisionSuffix}\" " +
            $"--set-env-vars \"NEXT_PUBLIC_API_URL={apiUrl}\" " +
            $"--output json";

        var output = BuildHelpers.RunCommandWithOutput(context, "az", updateArgs);

        var revisionName = System.Text.RegularExpressions.Regex.Match(output,
            @"""latestRevisionName""\s*:\s*""([^""]+)""").Groups[1].Value;

        context.Information($"✓ Frontend revision created: {revisionName}");
        return revisionName;
    }

    public static void ApplyPRLabels(ICakeContext context, BuildParameters parameters, string deploymentHash)
    {
        if (parameters.EnvironmentType != "preview")
            return;

        context.Information($"Applying label '{parameters.RevisionLabel}' to revisions...");

        // Find and label frontend revision
        ApplyLabelToRevision(context, parameters, "frontend", deploymentHash);

        // Find and label backend revision
        ApplyLabelToRevision(context, parameters, "backend", deploymentHash);

        context.Information($"✓ Label '{parameters.RevisionLabel}' applied successfully");
    }

    private static void ApplyLabelToRevision(ICakeContext context, BuildParameters parameters,
        string appType, string deploymentHash)
    {
        string revisionName = null;

        for (int attempt = 1; attempt <= 2; attempt++)
        {
            revisionName = BuildHelpers.RunCommandWithOutput(context, "az",
                $"containerapp revision list --resource-group {parameters.ResourceGroup} " +
                $"--name {parameters.NamePrefix}-{appType} " +
                $"--query \"[?properties.template.revisionSuffix=='{deploymentHash}'].name | [0]\" -o tsv").Trim();

            if (!string.IsNullOrWhiteSpace(revisionName) && revisionName != "null")
                break;

            if (attempt < 2)
                System.Threading.Thread.Sleep(3000);
        }

        if (string.IsNullOrWhiteSpace(revisionName) || revisionName == "null")
            throw new Exception($"Could not find {appType} revision with suffix '{deploymentHash}'");

        BuildHelpers.RunCommand(context, "az",
            $"containerapp revision label add --name {parameters.NamePrefix}-{appType} " +
            $"--resource-group {parameters.ResourceGroup} --label \"{parameters.RevisionLabel}\" " +
            $"--revision \"{revisionName}\" --yes");
    }

    public static void GetDeploymentUrls(ICakeContext context, BuildParameters parameters)
    {
        context.Information("Getting deployment URLs...");

        var frontendFqdn = BuildHelpers.RunCommandWithOutput(context, "az",
            $"containerapp show " +
            $"--name {parameters.NamePrefix}-frontend " +
            $"--resource-group {parameters.ResourceGroup} " +
            $"--query \"properties.configuration.ingress.fqdn\" -o tsv").Trim();

        var backendFqdn = BuildHelpers.RunCommandWithOutput(context, "az",
            $"containerapp show " +
            $"--name {parameters.NamePrefix}-backend " +
            $"--resource-group {parameters.ResourceGroup} " +
            $"--query \"properties.configuration.ingress.fqdn\" -o tsv").Trim();

        context.Information($"Frontend URL: https://{frontendFqdn}");
        context.Information($"Backend URL: https://{backendFqdn}");

        if (parameters.EnvironmentType == "preview")
        {
            var frontendDomain = frontendFqdn.Substring(frontendFqdn.IndexOf('.') + 1);
            var backendDomain = backendFqdn.Substring(backendFqdn.IndexOf('.') + 1);

            var frontendPrUrl = $"https://{parameters.NamePrefix}-frontend---{parameters.RevisionLabel}.{frontendDomain}";
            var backendPrUrl = $"https://{parameters.NamePrefix}-backend---{parameters.RevisionLabel}.{backendDomain}";

            context.Information($"Frontend PR URL: {frontendPrUrl}");
            context.Information($"Backend PR URL: {backendPrUrl}");

            // Set GitHub outputs if in GitHub Actions
            SetGitHubOutput(context, "frontend_pr_url", frontendPrUrl);
            SetGitHubOutput(context, "backend_pr_url", backendPrUrl);
        }

        SetGitHubOutput(context, "frontend_url", $"https://{frontendFqdn}");
        SetGitHubOutput(context, "backend_url", $"https://{backendFqdn}");
    }

    public static void CleanupPRRevisions(ICakeContext context, BuildParameters parameters)
    {
        context.Information($"Cleaning up PR {parameters.PRNumber} revisions...");

        RemoveRevisionWithLabel(context, parameters, "frontend", parameters.RevisionLabel);
        RemoveRevisionWithLabel(context, parameters, "backend", parameters.RevisionLabel);

        context.Information($"✓ Cleanup completed for PR {parameters.PRNumber}");
    }

    private static void SetGitHubOutput(ICakeContext context, string name, string value)
    {
        var githubOutput = context.EnvironmentVariable("GITHUB_OUTPUT");
        if (!string.IsNullOrEmpty(githubOutput))
        {
            System.IO.File.AppendAllText(githubOutput, $"{name}={value}\n");
        }
    }
}
