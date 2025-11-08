using Booking.Domain.Enums;

namespace Booking.Infrastructure.Repositories;

public class LocationFilter
{
    public int? Limit { get; set; }
    public LocationType? LocationType { get; set; }
    public string? OrganizationId { get; set; }
}