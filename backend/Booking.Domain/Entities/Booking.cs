namespace Booking.Domain.Entities;

public class Booking
{
    public Guid Id { get; private set; }
    public Guid LocationId { get; private set; }
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private Booking()
    {
        
    }

    public Booking(Guid locationId, DateTime startDate, DateTime endDate)
    {
        LocationId = locationId;
        StartDate = startDate;
        EndDate = endDate;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
}
