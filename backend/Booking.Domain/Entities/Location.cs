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
    public List<Booking> Bookings { get; private set; } = [];
    public LocationType LocationType { get; private set; }

    private Location() {}

    public Location(string name, string address, string description, int capacity, TimeSpan openTime, TimeSpan closeTime, LocationType locationType)
    {
        Id = Guid.CreateVersion7();
        Name = name;
        Address = address;
        Description = description;
        Capacity = capacity;
        OpenTime = openTime;
        CloseTime = closeTime;
        IsActive = false;
        LocationType = locationType;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public Booking Book(DateTime startTime, DateTime endTime)
    {
        var newBooking = new Booking(Id, startTime, endTime);

        if (!LocationType.Policies.All(policy => policy.CanBook(this, newBooking)))
            throw new InvalidOperationException("Booking violates one or more booking policies.");

        Bookings.Add(newBooking);
        return newBooking;
    }

    public void Activate() => IsActive = true;
}