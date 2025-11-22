using Booking.Application.Abstractions;
using Booking.Domain.Entities;
using Booking.Domain.Enums;
using Booking.Infrastructure.Data;
using Booking.Infrastructure.Repositories;

namespace Booking.Application.Features.Locations.CreateLocation;

public record CreateLocationCommand(
    string Name,
    string Address,
    string Description,
    int Capacity,
    TimeSpan OpenTime,
    TimeSpan CloseTime,
    LocationType LocationType,
    string OrganizationId,
    List<string>? Images = null
) : ICommand<Guid>;

public class CreateLocationCommandHandler(
    ILocationRepository _locationRepository,
    IUnitOfWork _unitOfWork
) : ICommandHandler<CreateLocationCommand, Guid>
{
    public async Task<Guid> HandleAsync(CreateLocationCommand command, CancellationToken cancellationToken = default)
    {
        var location = new Location(
            command.Name,
            command.Address,
            command.Description,
            command.Capacity,
            command.OpenTime,
            command.CloseTime,
            command.LocationType,
            command.OrganizationId,
            command.Images
        );

        // Activate the location by default when created
        location.Activate();

        await _locationRepository.AddAsync(location, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return location.Id;
    }
}
