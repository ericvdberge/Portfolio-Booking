using Booking.Application.Abstractions;
using Booking.Infrastructure.Repositories;

namespace Booking.Application.Features.Locations;

public record GetAllLocationsQuery : IQuery<IEnumerable<LocationDto>>;

public class GetAllLocationsHandler(
    ILocationRepository _locationRepository
) : IQueryHandler<GetAllLocationsQuery, IEnumerable<LocationDto>>
{
    public async Task<IEnumerable<LocationDto>> HandleAsync(GetAllLocationsQuery query, CancellationToken cancellationToken = default)
    {
        var availableLocations = await _locationRepository.GetAllAsync(cancellationToken);
        
        return availableLocations.Select(location => new LocationDto
        {
            Id = location.Id,
            Name = location.Name,
            Address = location.Address,
            Description = location.Description,
            Capacity = location.Capacity,
            OpenTime = location.OpenTime,
            CloseTime = location.CloseTime
        });
    }
}

public class LocationDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public TimeSpan OpenTime { get; set; }
    public TimeSpan CloseTime { get; set; }
}