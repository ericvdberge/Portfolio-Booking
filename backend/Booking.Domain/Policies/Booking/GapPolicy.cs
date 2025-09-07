using Booking.Domain.Abstractions;
using Booking.Domain.Entities;

namespace Booking.Domain.Policies.Booking;

public class GapPolicy(TimeSpan _gapTime) : BookingPolicy
{
    public override bool CanBook(Location location, Entities.Booking proposedBooking)
    {
        var existingBookings = location.Bookings
            .Where(b => b.EndTime <= proposedBooking.StartTime)
            .OrderByDescending(b => b.EndTime);

        var mostRecentBooking = existingBookings.FirstOrDefault();
        
        if (mostRecentBooking == null)
            return true;

        var timeBetweenBookings = proposedBooking.StartTime - mostRecentBooking.EndTime;
        return timeBetweenBookings >= _gapTime;
    }
}
