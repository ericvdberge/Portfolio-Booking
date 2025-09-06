using System.Linq.Expressions;
using Booking.Domain.Abstractions;
using Booking.Domain.Entities;

namespace Booking.Domain.Specifications;

public class IsAvailableNowSpecification : ISpecification<Location>
{
    private readonly DateTime _currentTime;

    public IsAvailableNowSpecification() : this(DateTime.UtcNow) { }

    public IsAvailableNowSpecification(DateTime currentTime)
    {
        _currentTime = currentTime;
    }

    public Expression<Func<Location, bool>> Criteria =>
        location => location.IsActive && 
                   (location.OpenTime <= location.CloseTime
                    ? _currentTime.TimeOfDay >= location.OpenTime && _currentTime.TimeOfDay <= location.CloseTime
                    : _currentTime.TimeOfDay >= location.OpenTime || _currentTime.TimeOfDay <= location.CloseTime);

    public bool IsSatisfiedBy(Location location)
    {
        return location.IsAvailableAtTime(_currentTime);
    }
}