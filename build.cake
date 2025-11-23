///////////////////////////////////////////////////////////////////////////////
// PORTFOLIO BOOKING SYSTEM - CAKE BUILD SCRIPT
///////////////////////////////////////////////////////////////////////////////

#load "build/parameters.cake"
#load "build/modules/helpers.cake"
#load "build/tasks/dotnet.cake"
#load "build/tasks/docker.cake"
#load "build/tasks/azure.cake"

///////////////////////////////////////////////////////////////////////////////
// SETUP
///////////////////////////////////////////////////////////////////////////////

var parameters = BuildParameters.GetParameters(Context);
var target = Argument("target", "Default");

Setup(ctx =>
{
    Information("========================================");
    Information("Portfolio Booking System - Build");
    Information("========================================");
    parameters.PrintInfo(ctx);
});

Teardown(ctx =>
{
    Information("Build completed!");
});

///////////////////////////////////////////////////////////////////////////////
// .NET BUILD TASKS
///////////////////////////////////////////////////////////////////////////////

Task("Clean")
    .Description("Clean build artifacts")
    .Does(() => DotNetTasks.Clean(Context, parameters));

Task("Restore")
    .Description("Restore NuGet packages")
    .Does(() => DotNetTasks.Restore(Context, parameters));

Task("Build")
    .Description("Build the solution")
    .IsDependentOn("Restore")
    .Does(() => DotNetTasks.Build(Context, parameters));

Task("Test")
    .Description("Run tests with coverage")
    .IsDependentOn("Build")
    .Does(() => DotNetTasks.Test(Context, parameters));

Task("Coverage-Report")
    .Description("Generate coverage report")
    .IsDependentOn("Test")
    .Does(() => DotNetTasks.GenerateCoverageReport(Context, parameters));

Task("Coverage-Check")
    .Description("Check coverage threshold")
    .IsDependentOn("Coverage-Report")
    .Does(() => DotNetTasks.CheckCoverageThreshold(Context, parameters));

///////////////////////////////////////////////////////////////////////////////
// DOCKER TASKS
///////////////////////////////////////////////////////////////////////////////

Task("Docker-Login")
    .Description("Login to Docker registry")
    .Does(() => DockerTasks.Login(Context, parameters));

Task("Docker-Build-Backend")
    .Description("Build backend Docker image")
    .Does(() => DockerTasks.BuildBackendImage(Context, parameters));

Task("Docker-Build-Frontend")
    .Description("Build frontend Docker image")
    .Does(() => DockerTasks.BuildFrontendImage(Context, parameters));

Task("Docker-Build")
    .Description("Build all Docker images")
    .IsDependentOn("Docker-Build-Backend")
    .IsDependentOn("Docker-Build-Frontend");

Task("Docker-Push-Backend")
    .Description("Push backend Docker image")
    .IsDependentOn("Docker-Login")
    .IsDependentOn("Docker-Build-Backend")
    .Does(() => DockerTasks.PushBackendImage(Context, parameters));

Task("Docker-Push-Frontend")
    .Description("Push frontend Docker image")
    .IsDependentOn("Docker-Login")
    .IsDependentOn("Docker-Build-Frontend")
    .Does(() => DockerTasks.PushFrontendImage(Context, parameters));

Task("Docker-Push")
    .Description("Build and push all Docker images")
    .IsDependentOn("Docker-Push-Backend")
    .IsDependentOn("Docker-Push-Frontend");

///////////////////////////////////////////////////////////////////////////////
// AZURE DEPLOYMENT TASKS
///////////////////////////////////////////////////////////////////////////////

Task("Azure-Login")
    .Description("Login to Azure")
    .Does(() => AzureTasks.Login(Context, parameters));

Task("Azure-Check-Infra")
    .Description("Check if infrastructure exists")
    .IsDependentOn("Azure-Login")
    .Does(() =>
{
    var exists = AzureTasks.CheckInfrastructureExists(Context, parameters);
    parameters.PrintInfo(Context);
});

Task("Azure-Remove-PR-Revisions")
    .Description("Remove existing PR revisions")
    .IsDependentOn("Azure-Login")
    .WithCriteria(() => parameters.EnvironmentType == "preview")
    .Does(() => AzureTasks.RemoveExistingPRRevisions(Context, parameters));

Task("Azure-Deploy-Infra")
    .Description("Deploy Azure infrastructure (first time)")
    .IsDependentOn("Azure-Login")
    .IsDependentOn("Azure-Remove-PR-Revisions")
    .Does(() =>
{
    var deploymentHash = AzureTasks.DeployInfrastructure(Context, parameters);
    if (parameters.EnvironmentType == "preview")
    {
        AzureTasks.ApplyPRLabels(Context, parameters, deploymentHash);
    }
    AzureTasks.GetDeploymentUrls(Context, parameters);
});

Task("Azure-Deploy-Revision")
    .Description("Deploy new revision (update)")
    .IsDependentOn("Azure-Login")
    .IsDependentOn("Azure-Remove-PR-Revisions")
    .Does(() =>
{
    var deploymentHash = AzureTasks.DeployRevision(Context, parameters);
    if (parameters.EnvironmentType == "preview")
    {
        AzureTasks.ApplyPRLabels(Context, parameters, deploymentHash);
    }
    AzureTasks.GetDeploymentUrls(Context, parameters);
});

Task("Azure-Get-URLs")
    .Description("Get deployment URLs")
    .IsDependentOn("Azure-Login")
    .Does(() => AzureTasks.GetDeploymentUrls(Context, parameters));

Task("Azure-Cleanup-PR")
    .Description("Cleanup PR preview environment")
    .IsDependentOn("Azure-Login")
    .Does(() => AzureTasks.CleanupPRRevisions(Context, parameters));

///////////////////////////////////////////////////////////////////////////////
// COMPOSITE TASKS
///////////////////////////////////////////////////////////////////////////////

Task("CI")
    .Description("Continuous Integration: Build, Test, Coverage")
    .IsDependentOn("Clean")
    .IsDependentOn("Build")
    .IsDependentOn("Test")
    .IsDependentOn("Coverage-Report")
    .IsDependentOn("Coverage-Check");

Task("Build-Images")
    .Description("Build and push Docker images")
    .IsDependentOn("Docker-Push");

Task("Deploy-Infra")
    .Description("Deploy infrastructure (checks if exists)")
    .IsDependentOn("Azure-Check-Infra")
    .Does(() =>
{
    var infraExists = AzureTasks.CheckInfrastructureExists(Context, parameters);
    if (infraExists)
    {
        Information("Infrastructure exists, deploying revision...");
        RunTarget("Azure-Deploy-Revision");
    }
    else
    {
        Information("Infrastructure does not exist, deploying full infrastructure...");
        RunTarget("Azure-Deploy-Infra");
    }
});

Task("Deploy-Preview")
    .Description("Full preview deployment pipeline")
    .IsDependentOn("Build-Images")
    .IsDependentOn("Deploy-Infra");

Task("Deploy-Production")
    .Description("Full production deployment pipeline")
    .IsDependentOn("Build-Images")
    .IsDependentOn("Deploy-Infra");

Task("Default")
    .Description("Default task (Build)")
    .IsDependentOn("Build");

///////////////////////////////////////////////////////////////////////////////
// EXECUTION
///////////////////////////////////////////////////////////////////////////////

RunTarget(target);
