using Booking.Application.Abstractions;
using Booking.Infrastructure.Repositories;

namespace Booking.Application.Features.Locations;

public record GetLocationByIdQuery(Guid Id) : IQuery<LocationDto?>;

public class GetLocationByIdHandler(
    ILocationRepository _locationRepository
) : IQueryHandler<GetLocationByIdQuery, LocationDto?>
{
    public async Task<LocationDto?> HandleAsync(GetLocationByIdQuery query, CancellationToken cancellationToken = default)
    {
        var location = await _locationRepository.GetByIdAsync(query.Id, cancellationToken);
        
        if (location == null)
            return null;
            
        return new LocationDto
        {
            Id = location.Id,
            Name = location.Name,
            Address = location.Address,
            Description = location.Description,
            Capacity = location.Capacity,
            OpenTime = location.OpenTime,
            CloseTime = location.CloseTime
        };
    }
}