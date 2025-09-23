using Booking.Domain.Abstractions;
using Booking.Domain.Entities;

namespace Booking.Domain.Policies.Booking;

public class MaxDurationPolicy(TimeSpan _maxDuration) : IBookingPolicy
{
    public bool CanBook(Location location, Entities.Booking proposedBooking)
    {
        return (proposedBooking.EndTime - proposedBooking.StartTime) <= _maxDuration;
    }

}
