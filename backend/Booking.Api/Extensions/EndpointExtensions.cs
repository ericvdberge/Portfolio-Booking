using Booking.Api.Abstractions;
using System.Reflection;

namespace Booking.Api.Extensions;

public static class EndpointExtensions
{
    public static IServiceCollection AddEndpoints(this IServiceCollection services)
    {
        services.Scan(scan => scan
            .FromAssemblyOf<Program>()
            .AddClasses(classes => classes.AssignableTo<IEndpoints>())
            .As<IEndpoints>()
            .WithScopedLifetime());

        return services;
    }

    public static IApplicationBuilder MapEndpoints(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var endpoints = scope.ServiceProvider.GetServices<IEndpoints>();

        foreach (var endpoint in endpoints)
            endpoint.MapEndpoints(app);

        return app;
    }
}