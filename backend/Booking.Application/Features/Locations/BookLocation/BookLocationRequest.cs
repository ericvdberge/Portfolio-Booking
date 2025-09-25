namespace Booking.Application.Features.Locations.BookLocation;

public record BookLocationRequest(
    DateTime StartDate,
    DateTime EndDate
);
