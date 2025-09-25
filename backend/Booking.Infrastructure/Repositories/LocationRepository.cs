using Booking.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Booking.Infrastructure.Repositories;

public class LocationRepository : ILocationRepository
{
    private readonly BookingDbContext _context;

    public LocationRepository(BookingDbContext context)
    {
        _context = context;
    }

    public async Task<Location?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Locations
            .Include(l => l.Bookings)
            .FirstOrDefaultAsync(l => l.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Location>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Locations
            .Where(l => l.IsActive)
            .ToListAsync(cancellationToken);
    }

    public async Task<Location> AddAsync(Location location, CancellationToken cancellationToken = default)
    {
        _context.Locations.Add(location);
        await _context.SaveChangesAsync(cancellationToken);
        return location;
    }

    public async Task<Location> UpdateAsync(Location location, CancellationToken cancellationToken = default)
    {
        _context.Locations.Update(location);
        await _context.SaveChangesAsync(cancellationToken);
        return location;
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var location = await GetByIdAsync(id, cancellationToken);
        if (location != null)
        {
            _context.Locations.Remove(location);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}