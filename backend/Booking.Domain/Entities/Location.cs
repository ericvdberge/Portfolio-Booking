using Booking.Domain.Abstractions;
using Booking.Domain.Enums;
using Booking.Domain.Policies;
using System.Data;
using System.Runtime.CompilerServices;

namespace Booking.Domain.Entities;

public class Location
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string Address { get; private set; }
    public string Description { get; private set; }
    public int Capacity { get; private set; }
    public bool IsActive { get; private set; }
    public TimeSpan OpenTime { get; private set; }
    public TimeSpan CloseTime { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }
    public LocationType LocationType { get; private set; }
    public string OrganizationId { get; private set; }
    public List<Booking> Bookings { get; private set; } = [];
    public List<PolicyConfig> PolicyConfigs { get; private set; } = [];

    public Location(string name, string address, string description, int capacity, TimeSpan openTime, TimeSpan closeTime, string organizationId)
    {
        Id = Guid.NewGuid();
        Name = name;
        Address = address;
        Description = description;
        Capacity = capacity;
        OpenTime = openTime;
        CloseTime = closeTime;
        OrganizationId = organizationId;
        IsActive = false;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public Booking Book(DateTime startDate, DateTime endDate)
    {
        var newBooking = new Booking(Id, startDate, endDate);

        var allPoliciesAllowed = GetEffectivePolicies().All(p => p.CanBook(this, newBooking));
        if (!allPoliciesAllowed)
            throw new InvalidOperationException();

        Bookings.Add(newBooking);
        return newBooking;
    }

    private IEnumerable<IBookingPolicy> GetEffectivePolicies()
    {
        var defaultPolicies = PolicyDefaults.For(LocationType);
        var policyProvider = new BookingPolicyProvider();

        var customPolicies = PolicyConfigs
            .Select(policyProvider.Create);

        //return custom policies
        foreach (var policy in customPolicies)
            yield return policy;

        //return default policies that are not overritten
        foreach (var policy in defaultPolicies.Where(dp => !customPolicies.Contains(dp)))
            yield return policy;
    }
    public void Activate() => IsActive = true;
}