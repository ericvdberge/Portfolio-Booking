using Booking.Application.Abstractions;
using Booking.Application.Features.Locations;
using Booking.Application.Features.Locations.BookLocation;
using Booking.Application.Features.Locations.CreateLocation;
using Microsoft.Extensions.DependencyInjection;

namespace Booking.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<ILogicDispatcher, LogicDispatcher>();
        services.AddScoped<IQueryHandler<GetAllLocationsQuery, IEnumerable<LocationDto>>, GetAllLocationsHandler>();
        services.AddScoped<IQueryHandler<GetLocationByIdQuery, LocationDto?>, GetLocationByIdHandler>();
        services.AddScoped<ICommandHandler<BookLocationCommand>, BookLocationCommandHandler>();
        services.AddScoped<ICommandHandler<CreateLocationCommand, Guid>, CreateLocationCommandHandler>();

        return services;
    }
}