using Booking.Domain.Abstractions;
using Booking.Domain.Entities;
using Booking.Domain.Enums;
using System.Reflection;

namespace Booking.Domain.Policies;

public class BookingPolicyProvider
{
    private readonly Dictionary<Policykey, Type> _map;

    public BookingPolicyProvider()
    {
        _map = Assembly.GetExecutingAssembly()
           .GetTypes()
           .Where(t => typeof(IBookingPolicy).IsAssignableFrom(t) && !t.IsInterface && !t.IsAbstract)
           .ToDictionary(
               t => ((IBookingPolicy)Activator.CreateInstance(t)!).Key,
               t => t
           );
    }

    public IBookingPolicy Create(PolicyConfig config)
    {
        var policy = (IBookingPolicy)Activator.CreateInstance(_map[config.Key])!;
        policy.Apply(config.SettingsJson);
        return policy;
    }
}
