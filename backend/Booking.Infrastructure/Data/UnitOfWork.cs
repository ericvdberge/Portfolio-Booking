namespace Booking.Infrastructure.Data;

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync();
}

public class UnitOfWork(BookingDbContext _context) : IUnitOfWork
{
    public async Task<int> SaveChangesAsync()
        => await _context.SaveChangesAsync();
}
