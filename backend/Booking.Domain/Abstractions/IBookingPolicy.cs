using Booking.Domain.Entities;

namespace Booking.Domain.Abstractions;

public interface IBookingPolicy
{
    bool CanBook(Location location, Entities.Booking proposedBooking);
}