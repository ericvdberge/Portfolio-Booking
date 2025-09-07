using Booking.Domain.Abstractions;
using Booking.Domain.Policies.Booking;

namespace Booking.Domain.Entities;

public class LocationType
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string Description { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    public readonly IReadOnlyCollection<BookingPolicy> Policies = [
        new NoOverlapPolicy(),
        new OpeningHoursPolicy(TimeSpan.FromHours(8), TimeSpan.FromHours(18)),
        new MaxDurationPolicy(TimeSpan.FromDays(7)),
        new AdvanceNoticePolicy(TimeSpan.FromHours(1)),
        new GapPolicy(TimeSpan.FromHours(1))
    ];

    private LocationType()
    {
        Name = string.Empty;
        Description = string.Empty;
    }

    public LocationType(string name, string description)
    {
        Id = Guid.CreateVersion7();
        Name = name;
        Description = description;
    }
}
