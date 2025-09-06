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

    private Location() { }

    public Location(string name, string address, string description, int capacity, TimeSpan openTime, TimeSpan closeTime)
    {
        Id = Guid.CreateVersion7();
        Name = name;
        Address = address;
        Description = description;
        Capacity = capacity;
        OpenTime = openTime;
        CloseTime = closeTime;
        IsActive = true;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool IsAvailableAtTime(DateTime dateTime)
    {
        if (!IsActive)
            return false;

        var timeOfDay = dateTime.TimeOfDay;
        
        if (OpenTime <= CloseTime)
        {
            return timeOfDay >= OpenTime && timeOfDay <= CloseTime;
        }
        else
        {
            return timeOfDay >= OpenTime || timeOfDay <= CloseTime;
        }
    }

    public bool IsAvailableNow()
    {
        return IsAvailableAtTime(DateTime.UtcNow);
    }

    public void UpdateAvailability(bool isActive)
    {
        IsActive = isActive;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateOperatingHours(TimeSpan openTime, TimeSpan closeTime)
    {
        OpenTime = openTime;
        CloseTime = closeTime;
        UpdatedAt = DateTime.UtcNow;
    }
}