///////////////////////////////////////////////////////////////////////////////
// .NET BUILD TASKS
///////////////////////////////////////////////////////////////////////////////

#load "../modules/helpers.cake"

public static class DotNetTasks
{
    public static void Clean(ICakeContext context, BuildParameters parameters)
    {
        context.Information("Cleaning build artifacts...");

        BuildHelpers.CleanDirectory(context, parameters.TestResultsDirectory);
        BuildHelpers.CleanDirectory(context, parameters.CoverageReportDirectory);

        context.DotNetClean(parameters.SolutionFile, new DotNetCleanSettings
        {
            Configuration = parameters.Configuration
        });
    }

    public static void Restore(ICakeContext context, BuildParameters parameters)
    {
        context.Information("Restoring NuGet packages...");

        context.DotNetRestore(parameters.SolutionFile);
    }

    public static void Build(ICakeContext context, BuildParameters parameters)
    {
        context.Information($"Building solution in {parameters.Configuration} mode...");

        context.DotNetBuild(parameters.SolutionFile, new DotNetBuildSettings
        {
            Configuration = parameters.Configuration,
            NoRestore = true
        });
    }

    public static void Test(ICakeContext context, BuildParameters parameters)
    {
        context.Information("Running tests with coverage...");

        BuildHelpers.EnsureDirectoryExists(context, parameters.TestResultsDirectory);

        context.DotNetTest(parameters.SolutionFile, new DotNetTestSettings
        {
            Configuration = parameters.Configuration,
            NoBuild = true,
            Verbosity = DotNetVerbosity.Normal,
            ArgumentCustomization = args => args
                .Append("--collect:\"XPlat Code Coverage\"")
                .Append($"--results-directory \"{parameters.TestResultsDirectory}\"")
                .Append("--logger \"trx;LogFileName=test-results.trx\"")
                .Append("--")
                .Append("DataCollectionRunSettings.DataCollectors.DataCollector.Configuration.Format=opencover")
        });
    }

    public static void GenerateCoverageReport(ICakeContext context, BuildParameters parameters)
    {
        context.Information("Generating coverage report...");

        BuildHelpers.EnsureDirectoryExists(context, parameters.CoverageReportDirectory);

        var coverageFiles = context.GetFiles($"{parameters.TestResultsDirectory}/**/coverage.opencover.xml");

        if (coverageFiles.Count == 0)
        {
            context.Warning("No coverage files found!");
            return;
        }

        var reportTypes = "HtmlInline;Cobertura;MarkdownSummaryGithub";

        context.Information($"Found {coverageFiles.Count} coverage file(s)");
        context.Information($"Generating report types: {reportTypes}");

        BuildHelpers.RunCommand(context, "dotnet",
            $"reportgenerator " +
            $"-reports:\"{parameters.TestResultsDirectory}/**/coverage.opencover.xml\" " +
            $"-targetdir:\"{parameters.CoverageReportDirectory}\" " +
            $"-reporttypes:{reportTypes} " +
            $"-sourcedirs:\"{parameters.BackendDirectory}\" " +
            $"-title:\"Backend Code Coverage\"");
    }

    public static void CheckCoverageThreshold(ICakeContext context, BuildParameters parameters)
    {
        context.Information($"Checking coverage threshold ({parameters.CoverageThreshold}%)...");

        var coverageFile = context.GetFiles($"{parameters.TestResultsDirectory}/**/coverage.opencover.xml")
            .FirstOrDefault();

        if (coverageFile == null)
        {
            throw new Exception("No coverage file found!");
        }

        var xml = System.Xml.Linq.XDocument.Load(coverageFile.FullPath);
        var summary = xml.Descendants("Summary").FirstOrDefault();

        if (summary == null)
        {
            throw new Exception("Could not find Summary element in coverage report!");
        }

        var sequenceCoverage = double.Parse(summary.Attribute("sequenceCoverage").Value);
        var visitedSequencePoints = int.Parse(summary.Attribute("visitedSequencePoints").Value);
        var numSequencePoints = int.Parse(summary.Attribute("numSequencePoints").Value);

        context.Information($"Line Coverage: {sequenceCoverage}%");
        context.Information($"Covered Lines: {visitedSequencePoints}/{numSequencePoints}");

        if (sequenceCoverage < parameters.CoverageThreshold)
        {
            throw new Exception(
                $"Coverage ({sequenceCoverage}%) is below threshold ({parameters.CoverageThreshold}%)");
        }

        context.Information($"✓ Coverage check passed: {sequenceCoverage}% >= {parameters.CoverageThreshold}%");
    }
}
