using System.Linq.Expressions;

namespace Booking.Domain.Abstractions;

public interface ISpecification<T>
{
    Expression<Func<T, bool>> Criteria { get; }
    bool IsSatisfiedBy(T entity);
}