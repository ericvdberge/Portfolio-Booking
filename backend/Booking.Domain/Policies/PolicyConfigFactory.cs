using Booking.Domain.Abstractions;
using Booking.Domain.Policies.Booking;
using System.Text.Json;

namespace Booking.Domain.Policies;

public class PolicyConfigFactory
{
    private static Dictionary<string, Type> _configs = new()
    {
        ["advance-notice"] = typeof(AdvanceNoticePolicy)
    };

    public static IPolicyConfig FromJson(string name, string json)
    {
        var type = _configs[name];
        return (IPolicyConfig)JsonSerializer.Deserialize(json, type)!;
    }
}
