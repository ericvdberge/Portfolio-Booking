using Booking.Domain.Entities;

namespace Booking.Domain.Abstractions;

public abstract class BookingPolicy
{
    public abstract bool CanBook(Location location, Entities.Booking proposedBooking);
}