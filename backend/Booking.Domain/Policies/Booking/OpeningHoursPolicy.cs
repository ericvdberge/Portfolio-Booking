using Booking.Domain.Abstractions;
using Booking.Domain.Entities;

namespace Booking.Domain.Policies.Booking;

public class OpeningHoursPolicy(TimeSpan open, TimeSpan close): BookingPolicy
{
    public override bool CanBook(Location location, Entities.Booking proposedBooking)
    {
        var bookingStart = proposedBooking.StartTime.TimeOfDay;
        var bookingEnd = proposedBooking.EndTime.TimeOfDay;

        return bookingStart >= open && bookingEnd <= close;
    }

}
