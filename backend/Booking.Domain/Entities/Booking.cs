namespace Booking.Domain.Entities;

public class Booking
{
    public Guid Id { get; private set; }
    public Guid LocationId { get; private set; }
    public DateTime StartTime { get; private set; }
    public DateTime EndTime { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private Booking()
    {
        
    }

    public Booking(Guid locationId, DateTime startTime, DateTime endTime)
    {
        Id = Guid.CreateVersion7();
        LocationId = locationId;
        StartTime = startTime;
        EndTime = endTime;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
}
