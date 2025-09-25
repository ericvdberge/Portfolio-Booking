using Booking.Domain.Abstractions;
using Booking.Domain.Enums;
using Booking.Domain.Policies.Booking;

namespace Booking.Domain.Policies.DefaultPolicyProviders;

public class HotelDefaultPoliciesProvider : IDefaultPolicyProvider
{
    public LocationType Type => LocationType.Hotel;

    public IEnumerable<IBookingPolicy> GetDefaults()
    {
        yield return new AdvanceNoticePolicy(TimeSpan.FromDays(2));
        yield return new GapPolicy(TimeSpan.FromDays(1));
        yield return new NoOverlapPolicy();
    }
}
