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
    public List<Booking> Bookings { get; private set; } = [];
    public List<PolicyConfig> PolicyConfigs { get; private set; } = [];

    private Location() {}

    public Location(string name, string address, string description, int capacity, TimeSpan openTime, TimeSpan closeTime)
    {
        Id = Guid.CreateVersion7();
        Name = name;
        Address = address;
        Description = description;
        Capacity = capacity;
        OpenTime = openTime;
        CloseTime = closeTime;
        IsActive = false;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public Booking Book(DateTime startTime, DateTime endTime)
    {
        var newBooking = new Booking(Id, startTime, endTime);

        var allPoliciesAllowed = GetEffectivePolicies().All(p => p.CanBook(this, newBooking));
        if (!allPoliciesAllowed)
            throw new InvalidOperationException();

        Bookings.Add(newBooking);
        return newBooking;
    }

    public IEnumerable<IBookingPolicy> GetEffectivePolicies()
    {
        var defaultPolicies = PolicyDefaults.For(LocationType);

        var customPolicies = PolicyConfigs
            .Select(p => p.ToPolicy());

        //Todo: make custom policy override default policy and remove duplicates
        return defaultPolicies.Concat(customPolicies);
    }

    public void Activate() => IsActive = true;
}