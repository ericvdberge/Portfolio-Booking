using Booking.Domain.Enums;

namespace Booking.Domain.Abstractions;

public interface IDefaultPolicyProvider
{
    LocationType Type { get; }
    IEnumerable<IBookingPolicy> GetDefaults();
}
