using Booking.Api.Abstractions;
using Booking.Application.Abstractions;
using Booking.Application.Features.Locations;
using Booking.Application.Features.Locations.CreateLocation;
using Booking.Domain.Enums;
using Booking.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Booking.Api.Endpoints;

public class DashboardLocationEndpoints : IEndpoints
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/dashboard/locations")
            .WithTags("Dashboard - Locations");

        group.MapGet("/", GetDashboardLocations)
            .WithName("GetDashboardLocations")
            .Produces<IEnumerable<LocationDto>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Get locations for the authenticated user's organization",
                Description = "Returns locations filtered by the user's organization ID from HttpContext. For now, pass X-Organization-Id header."
            });

        group.MapPost("/", CreateDashboardLocation)
            .WithName("CreateDashboardLocation")
            .Produces<Guid>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Create a new location for the authenticated user's organization",
                Description = "Creates a new location assigned to the user's organization ID from HttpContext. For now, pass X-Organization-Id header."
            });
    }

    private async Task<IResult> GetDashboardLocations(
        HttpContext httpContext,
        [FromServices] ILogicDispatcher _dispatcher,
        [FromQuery] int? limit,
        [FromQuery] LocationType? locationType,
        CancellationToken cancellationToken)
    {
        // Extract OrganizationId from HttpContext
        // For now, we'll use a custom header. In production, this would come from JWT claims
        var organizationId = httpContext.Request.Headers["X-Organization-Id"].FirstOrDefault();

        if (string.IsNullOrWhiteSpace(organizationId))
        {
            return Results.Problem(
                statusCode: StatusCodes.Status401Unauthorized,
                title: "Unauthorized",
                detail: "Organization ID not found. Please provide X-Organization-Id header."
            );
        }

        var filter = new LocationFilter
        {
            Limit = limit,
            LocationType = locationType,
            OrganizationId = organizationId
        };

        var locations = await _dispatcher.SendAsync(
            new GetAllLocationsQuery(filter),
            cancellationToken
        );

        return Results.Ok(locations);
    }

    private async Task<IResult> CreateDashboardLocation(
        HttpContext httpContext,
        [FromServices] ILogicDispatcher _dispatcher,
        [FromBody] CreateLocationRequest request,
        CancellationToken cancellationToken)
    {
        // Extract OrganizationId from HttpContext
        // For now, we'll use a custom header. In production, this would come from JWT claims
        var organizationId = httpContext.Request.Headers["X-Organization-Id"].FirstOrDefault();

        if (string.IsNullOrWhiteSpace(organizationId))
        {
            return Results.Problem(
                statusCode: StatusCodes.Status401Unauthorized,
                title: "Unauthorized",
                detail: "Organization ID not found. Please provide X-Organization-Id header."
            );
        }

        var locationId = await _dispatcher.SendAsync(
            new CreateLocationCommand(
                request.Name,
                request.Address,
                request.Description,
                request.Capacity,
                request.OpenTime,
                request.CloseTime,
                request.LocationType,
                organizationId,
                request.Images
            ),
            cancellationToken
        );

        return Results.Created($"/api/dashboard/locations/{locationId}", locationId);
    }
}
