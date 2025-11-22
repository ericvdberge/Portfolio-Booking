using Booking.Domain.Enums;

namespace Booking.Application.Features.Locations.CreateLocation;

public record CreateLocationRequest(
    string Name,
    string Address,
    string Description,
    int Capacity,
    TimeSpan OpenTime,
    TimeSpan CloseTime,
    LocationType LocationType,
    List<string>? Images = null
);
