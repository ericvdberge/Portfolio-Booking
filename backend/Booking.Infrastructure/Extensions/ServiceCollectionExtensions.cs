using Booking.Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace Booking.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddDbContext<BookingDbContext>();
        
        services.AddScoped<ILocationRepository, LocationRepository>();

        return services;
    }
}