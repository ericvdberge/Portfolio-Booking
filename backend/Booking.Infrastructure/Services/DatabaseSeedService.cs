using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Booking.Infrastructure.Services;

public class DatabaseSeedService(BookingDbContext context, ILogger<DatabaseSeedService> logger)
{
    private readonly BookingDbContext _context = context;
    private readonly ILogger<DatabaseSeedService> _logger = logger;

    public async Task SeedAsync()
    {
        try
        {
            _logger.LogInformation("Starting database initialization and seeding...");
            
            // Execute table creation scripts first
            await ExecuteScriptsFromDirectory("Tables", "table creation");
            
            // Then execute seed scripts
            await ExecuteScriptsFromDirectory("Seed", "data seeding");

            _logger.LogInformation("Database initialization and seeding completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while initializing/seeding the database");
            throw;
        }
    }

    private async Task ExecuteScriptsFromDirectory(string directoryName, string scriptType)
    {
        var scriptsPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "Scripts", directoryName);
        
        if (!Directory.Exists(scriptsPath))
        {
            _logger.LogWarning("{ScriptType} scripts directory not found at: {ScriptsPath}", scriptType, scriptsPath);
            return;
        }

        var scriptFiles = Directory.GetFiles(scriptsPath, "*.sql")
            .OrderBy(f => Path.GetFileName(f))
            .ToList();

        if (!scriptFiles.Any())
        {
            _logger.LogInformation("No {ScriptType} scripts found in {ScriptsPath}", scriptType, scriptsPath);
            return;
        }

        _logger.LogInformation("Found {Count} {ScriptType} scripts to execute", scriptFiles.Count, scriptType);

        foreach (var scriptFile in scriptFiles)
        {
            await ExecuteScriptAsync(scriptFile, scriptType);
        }
    }

    private async Task ExecuteScriptAsync(string scriptPath, string scriptType)
    {
        try
        {
            var scriptName = Path.GetFileName(scriptPath);
            _logger.LogInformation("Executing {ScriptType} script: {ScriptName}", scriptType, scriptName);

            var scriptContent = await File.ReadAllTextAsync(scriptPath);
            
            if (string.IsNullOrWhiteSpace(scriptContent))
            {
                _logger.LogWarning("Script {ScriptName} is empty, skipping", scriptName);
                return;
            }

            await _context.Database.ExecuteSqlRawAsync(scriptContent);
            _logger.LogInformation("Successfully executed {ScriptType} script: {ScriptName}", scriptType, scriptName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to execute {ScriptType} script: {ScriptPath}", scriptType, scriptPath);
            throw;
        }
    }
}