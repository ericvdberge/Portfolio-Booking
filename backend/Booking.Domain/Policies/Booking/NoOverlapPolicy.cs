using Booking.Domain.Abstractions;
using Booking.Domain.Entities;

namespace Booking.Domain.Policies.Booking;

public class NoOverlapPolicy : IBookingPolicy
{
    public bool CanBook(Location location, Entities.Booking proposedBooking)
    {
        return location.Bookings.All(existing =>
            proposedBooking.EndTime <= existing.StartTime ||
            proposedBooking.StartTime >= existing.EndTime);
    }
}