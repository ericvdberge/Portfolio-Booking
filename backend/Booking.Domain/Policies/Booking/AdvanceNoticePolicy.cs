using Booking.Domain.Abstractions;
using Booking.Domain.Entities;
using System.Text.Json;

namespace Booking.Domain.Policies.Booking;

public class AdvanceNoticePolicy(TimeSpan _advanceTime) : IConfigurablePolicy<AdvanceNoticePolicyConfig>
{
    public bool CanBook(Location location, Entities.Booking proposedBooking)
    {
        return proposedBooking.StartTime - DateTime.UtcNow >= _advanceTime;
    }

    public static IBookingPolicy FromConfig(AdvanceNoticePolicyConfig config) 
        => new AdvanceNoticePolicy(config.AdvanceTime);
}

public class AdvanceNoticePolicyConfig: IPolicyConfig
{
    public Guid Id { get; private set; }
    public string Name => "advance-notice";
    public TimeSpan AdvanceTime { get; private set; }
    public AdvanceNoticePolicyConfig(TimeSpan advanceTime)
    {
        Id = Guid.NewGuid();
        AdvanceTime = advanceTime;
    }
    public IBookingPolicy ToPolicy() => new AdvanceNoticePolicy(AdvanceTime);
}
