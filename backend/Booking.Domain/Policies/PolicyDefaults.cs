using Booking.Domain.Abstractions;
using Booking.Domain.Enums;
using Booking.Domain.Policies.DefaultPolicyProviders;

namespace Booking.Domain.Policies;

public static class PolicyDefaults
{
    private static readonly List<IDefaultPolicyProvider> DefaultPolicies = [
        new HotelDefaultPoliciesProvider()
    ];

    public static IEnumerable<IBookingPolicy> For(LocationType locationType)
    {
        var provider = DefaultPolicies.First(p => p.Type == locationType);
        return provider.GetDefaults();
    }
}
