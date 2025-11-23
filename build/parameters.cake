///////////////////////////////////////////////////////////////////////////////
// BUILD PARAMETERS
///////////////////////////////////////////////////////////////////////////////

public class BuildParameters
{
    // Paths
    public string RootDirectory { get; }
    public string BackendDirectory { get; }
    public string FrontendDirectory { get; }
    public string TestResultsDirectory { get; }
    public string CoverageReportDirectory { get; }
    public string InfrastructureDirectory { get; }

    // Build Configuration
    public string Configuration { get; }
    public string SolutionFile { get; }
    public string CISolutionFile { get; }

    // Docker Configuration
    public string Registry { get; }
    public string BackendImageName { get; }
    public string FrontendImageName { get; }
    public string ImageTag { get; }
    public string BackendImageFull => $"{Registry}/{BackendImageName}:{ImageTag}";
    public string FrontendImageFull => $"{Registry}/{FrontendImageName}:{ImageTag}";

    // Azure Configuration
    public string AzureClientId { get; }
    public string AzureTenantId { get; }
    public string AzureSubscriptionId { get; }
    public string ResourceGroup { get; }
    public string Location { get; }
    public string NamePrefix { get; }

    // Deployment Configuration
    public string EnvironmentType { get; } // production or preview
    public string PRNumber { get; }
    public string DeploymentSuffix { get; }
    public string RevisionLabel => EnvironmentType == "preview" ? $"pr-{PRNumber}" : "";

    // Secrets
    public string DbPassword { get; }
    public string RegistryUsername { get; }
    public string RegistryPassword { get; }

    // Test Configuration
    public double CoverageThreshold { get; }

    private BuildParameters(ICakeContext context)
    {
        // Paths
        RootDirectory = context.MakeAbsolute(context.Directory(".")).FullPath;
        BackendDirectory = context.MakeAbsolute(context.Directory("./backend")).FullPath;
        FrontendDirectory = context.MakeAbsolute(context.Directory("./frontend")).FullPath;
        TestResultsDirectory = context.MakeAbsolute(context.Directory("./backend/TestResults")).FullPath;
        CoverageReportDirectory = context.MakeAbsolute(context.Directory("./backend/CoverageReport")).FullPath;
        InfrastructureDirectory = context.MakeAbsolute(context.Directory("./infrastructure")).FullPath;

        // Build
        Configuration = context.Argument("configuration", "Release");
        SolutionFile = $"{BackendDirectory}/booking.sln";
        CISolutionFile = $"{BackendDirectory}/booking-ci.sln";

        // Docker
        Registry = context.Argument("registry", context.EnvironmentVariable("REGISTRY") ?? "ghcr.io");
        BackendImageName = context.Argument("backend-image-name",
            context.EnvironmentVariable("BACKEND_IMAGE_NAME") ?? "ericvdberge/portfolio-booking/backend");
        FrontendImageName = context.Argument("frontend-image-name",
            context.EnvironmentVariable("FRONTEND_IMAGE_NAME") ?? "ericvdberge/portfolio-booking/frontend");
        ImageTag = context.Argument("image-tag",
            context.EnvironmentVariable("IMAGE_TAG") ?? "latest");

        // Azure
        AzureClientId = context.Argument("azure-client-id", context.EnvironmentVariable("AZURE_CLIENT_ID") ?? "");
        AzureTenantId = context.Argument("azure-tenant-id", context.EnvironmentVariable("AZURE_TENANT_ID") ?? "");
        AzureSubscriptionId = context.Argument("azure-subscription-id", context.EnvironmentVariable("AZURE_SUBSCRIPTION_ID") ?? "");
        ResourceGroup = context.Argument("resource-group",
            context.EnvironmentVariable("RESOURCE_GROUP") ?? "BookingSystem");
        Location = context.Argument("location", context.EnvironmentVariable("LOCATION") ?? "swedencentral");
        NamePrefix = context.Argument("name-prefix", context.EnvironmentVariable("NAME_PREFIX") ?? "pbooking");

        // Deployment
        EnvironmentType = context.Argument("environment-type",
            context.EnvironmentVariable("ENVIRONMENT_TYPE") ?? "production");
        PRNumber = context.Argument("pr-number", context.EnvironmentVariable("PR_NUMBER") ?? "");
        DeploymentSuffix = EnvironmentType == "preview" ? $"pr-{PRNumber}" : "";

        // Secrets
        DbPassword = context.Argument("db-password", context.EnvironmentVariable("DB_PASSWORD") ?? "");
        RegistryUsername = context.Argument("registry-username",
            context.EnvironmentVariable("REGISTRY_USERNAME") ?? "");
        RegistryPassword = context.Argument("registry-password",
            context.EnvironmentVariable("REGISTRY_PASSWORD") ?? "");

        // Tests
        CoverageThreshold = double.Parse(context.Argument("coverage-threshold",
            context.EnvironmentVariable("COVERAGE_THRESHOLD") ?? "90"));
    }

    public static BuildParameters GetParameters(ICakeContext context)
    {
        return new BuildParameters(context);
    }

    public void PrintInfo(ICakeContext context)
    {
        context.Information("=== Build Parameters ===");
        context.Information($"Configuration: {Configuration}");
        context.Information($"Environment: {EnvironmentType}");
        context.Information($"Image Tag: {ImageTag}");
        context.Information($"Backend Image: {BackendImageFull}");
        context.Information($"Frontend Image: {FrontendImageFull}");
        if (!string.IsNullOrEmpty(PRNumber))
            context.Information($"PR Number: {PRNumber}");
        context.Information($"Resource Group: {ResourceGroup}");
        context.Information("========================");
    }
}
