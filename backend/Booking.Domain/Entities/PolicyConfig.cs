using Booking.Domain.Abstractions;
using Booking.Domain.Policies;

namespace Booking.Domain.Entities;

public class PolicyConfig
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public required string SettingsJson { get; set; }

    public IBookingPolicy ToPolicy()
    {
        return PolicyConfigFactory.FromJson(Name, SettingsJson).ToPolicy();
    }
}
