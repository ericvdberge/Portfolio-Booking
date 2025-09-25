using Booking.Domain.Abstractions;
using Booking.Domain.Entities;
using Booking.Domain.Enums;
using System.Text.Json;

namespace Booking.Domain.Policies.Booking;

public class GapPolicy(TimeSpan _gapTime) : IBookingPolicy
{
    public Policykey Key => Policykey.GapPolicy;
    public bool CanBook(Location location, Entities.Booking proposedBooking)
    {
        var existingBookings = location.Bookings
            .Where(b => b.EndDate <= proposedBooking.EndDate)
            .OrderByDescending(b => b.EndDate);

        var mostRecentBooking = existingBookings.FirstOrDefault();
        
        if (mostRecentBooking == null)
            return true;

        var timeBetweenBookings = proposedBooking.StartDate - mostRecentBooking.EndDate;
        return timeBetweenBookings >= _gapTime;
    }

    public void Apply(string settingsJson)
    {
        var cfg = JsonSerializer.Deserialize<GapPolicySettings>(settingsJson)!;
        _gapTime = cfg.GapTime;
    }
}

public record GapPolicySettings(TimeSpan GapTime);
