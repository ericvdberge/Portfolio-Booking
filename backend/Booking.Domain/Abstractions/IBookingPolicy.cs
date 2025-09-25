using Booking.Domain.Entities;
using Booking.Domain.Enums;

namespace Booking.Domain.Abstractions;

public interface IBookingPolicy
{
    static Policykey Key { get; }
    bool CanBook(Location location, Entities.Booking proposedBooking);
    void Apply(string settingsJson);
}