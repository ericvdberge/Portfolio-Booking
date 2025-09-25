using Booking.Domain.Abstractions;
using Booking.Domain.Entities;
using Booking.Domain.Enums;
using System.Text.Json;

namespace Booking.Domain.Policies.Booking;

public class AdvanceNoticePolicy(TimeSpan _advanceTime) : IBookingPolicy
{
    public Policykey Key => Policykey.AdvanceNoticePolicy;

    public bool CanBook(Location location, Entities.Booking proposedBooking)
    {
        return proposedBooking.StartDate - DateTime.UtcNow >= _advanceTime;
    }

    public void Apply(string settingsJson)
    {
        var cfg = JsonSerializer.Deserialize<AdvanceNoticePolicySettings>(settingsJson)!;
        _advanceTime = cfg.AdvanceTime;
    }
}

public record AdvanceNoticePolicySettings(TimeSpan AdvanceTime);