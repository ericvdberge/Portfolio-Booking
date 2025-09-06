using Booking.Api.Abstractions;

namespace Booking.Api.Endpoints;

public class BookingEndpoints : IEndpoints
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/bookings")
            .WithTags("Bookings");

        group.MapGet("/", () => "Welcome to Booking API!");
        group.MapGet("/{id:int}", (int id) => $"Booking {id}");
        group.MapPost("/", (object booking) => Results.Created($"/api/bookings/1", booking));
    }
}