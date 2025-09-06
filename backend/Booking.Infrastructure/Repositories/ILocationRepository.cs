using Booking.Domain.Entities;

namespace Booking.Infrastructure.Repositories;

public interface ILocationRepository
{
    Task<IEnumerable<Location>> GetAvailableNowAsync(CancellationToken cancellationToken = default);
    Task<Location?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Location>> GetAllAsync(CancellationToken cancellationToken = default);
}