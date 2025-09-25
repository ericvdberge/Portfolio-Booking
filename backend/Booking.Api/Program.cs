using Booking.Api.Extensions;
using Booking.Application.Extensions;
using Booking.Infrastructure.Extensions;
using Booking.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDangerousCors();
builder.Services.AddOpenApi();
builder.Services.AddEndpoints();
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

// Seed database on startup
using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeedService>();
    await seeder.SeedAsync();
}


app.UseCors();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/", () => "Booking API is running...");
app.MapEndpoints();
app.Run();
