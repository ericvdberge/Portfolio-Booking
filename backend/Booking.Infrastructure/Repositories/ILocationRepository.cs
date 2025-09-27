using Booking.Domain.Entities;

namespace Booking.Infrastructure.Repositories;

public interface ILocationRepository
{
    Task<Location?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Location>> GetAllAsync(LocationFilter? filter = null, CancellationToken cancellationToken = default);
    Task<Location> AddAsync(Location location, CancellationToken cancellationToken = default);
    Task<Location> UpdateAsync(Location location, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}