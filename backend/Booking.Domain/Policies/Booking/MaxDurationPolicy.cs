using Booking.Domain.Abstractions;
using Booking.Domain.Entities;
using Booking.Domain.Enums;
using System.Text.Json;

namespace Booking.Domain.Policies.Booking;

public class MaxDurationPolicy : IBookingPolicy
{
    private TimeSpan _maxDuration;

    public MaxDurationPolicy() : this(TimeSpan.MaxValue)
    {
    }

    public MaxDurationPolicy(TimeSpan maxDuration)
    {
        _maxDuration = maxDuration;
    }

    public static Policykey Key => Policykey.MaxDurationPolicy;

    public bool CanBook(Location location, Entities.Booking proposedBooking)
    {
        return (proposedBooking.EndDate - proposedBooking.StartDate) <= _maxDuration;
    }

    public void Apply(string settingsJson)
    {
        var cfg = JsonSerializer.Deserialize<MaxDurationPolicySettings>(settingsJson)!;
        _maxDuration = cfg.MaxDuration;
    }
}

public record MaxDurationPolicySettings(TimeSpan MaxDuration);
