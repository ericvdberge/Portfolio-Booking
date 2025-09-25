namespace Booking.Infrastructure.Data;

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync();
}

public class UnitOfWork(BookingDbContext _context) : IUnitOfWork
{
    public Task<int> SaveChangesAsync()
        => _context.SaveChangesAsync();
}
