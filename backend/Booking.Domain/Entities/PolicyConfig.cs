using Booking.Domain.Enums;

namespace Booking.Domain.Entities;

public class PolicyConfig
{
    public required Guid Id { get; set; }
    public required Policykey Key { get; set; }
    public required string SettingsJson { get; set; }
}
