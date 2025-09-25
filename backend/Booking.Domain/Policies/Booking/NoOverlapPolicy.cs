using Booking.Domain.Abstractions;
using Booking.Domain.Entities;
using Booking.Domain.Enums;

namespace Booking.Domain.Policies.Booking;

public class NoOverlapPolicy : IBookingPolicy
{
    public static Policykey Key => Policykey.NoOverlapPolicy;

    public bool CanBook(Location location, Entities.Booking proposedBooking)
    {
        return location.Bookings.All(existing =>
            proposedBooking.EndDate <= existing.StartDate ||
            proposedBooking.StartDate >= existing.EndDate);
    }

    public void Apply(string settingsJson)
    {
        throw new NotImplementedException("no config for this policy");
    }
}