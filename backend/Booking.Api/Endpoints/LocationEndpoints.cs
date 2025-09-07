using Booking.Api.Abstractions;
using Booking.Application.Abstractions;
using Booking.Application.Features.Locations;
using Microsoft.AspNetCore.Mvc;

namespace Booking.Api.Endpoints;

public class LocationEndpoints : IEndpoints
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/locations")
            .WithTags("Locations");

        group.MapGet("/", GetAllLocations)
            .WithName("GetAllLocations")
            .Produces<IEnumerable<LocationDto>>(StatusCodes.Status200OK)
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Get all available locations",
                Description = "Returns a list of all locations that are currently available for booking"
            });

        group.MapGet("/{id:guid}", GetLocationById)
            .WithName("GetLocationById")
            .Produces<LocationDto>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Get location by ID",
                Description = "Returns a specific location by its unique identifier"
            });
    }

    private async Task<IResult> GetAllLocations(
        [FromServices] ILogicDispatcher _dispatcher,
        CancellationToken cancellationToken)
    {
        var locations = await _dispatcher.SendAsync(
            new GetAllLocationsQuery(),
            cancellationToken
        );
        return Results.Ok(locations);
    }

    private async Task<IResult> GetLocationById(
        [FromRoute] Guid id,
        [FromServices] ILogicDispatcher _dispatcher,
        CancellationToken cancellationToken)
    {
        var location = await _dispatcher.SendAsync(
            new GetLocationByIdQuery(id),
            cancellationToken
        );
        
        if (location == null)
            return Results.NotFound($"Location with ID {id} not found");
            
        return Results.Ok(location);
    }
}