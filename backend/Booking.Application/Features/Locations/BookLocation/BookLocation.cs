using Booking.Application.Abstractions;
using Booking.Infrastructure.Data;
using Booking.Infrastructure.Repositories;

namespace Booking.Application.Features.Locations.BookLocation;

public record BookLocationCommand(
    Guid LocationId,
    DateTime StartTime,
    DateTime EndTime
): ICommand;

public class BookLocationCommandHandler(
    ILocationRepository _locationRepository,
    IUnitOfWork _unitOfWork
) : ICommandHandler<BookLocationCommand>
{
    public async Task HandleAsync(BookLocationCommand command, CancellationToken cancellationToken = default)
    {
        var location = await _locationRepository.GetByIdAsync(command.LocationId, cancellationToken)
            ?? throw new KeyNotFoundException();

        location.Book(command.StartTime, command.EndTime);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
