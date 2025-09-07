using Booking.Domain.Abstractions;
using Booking.Domain.Entities;

namespace Booking.Domain.Policies.Booking;

public class AdvanceNoticePolicy(TimeSpan _advanceTime) : BookingPolicy
{
    public override bool CanBook(Location location, Entities.Booking proposedBooking)
    {
        return proposedBooking.StartTime - DateTime.UtcNow >= _advanceTime;
    }
}
