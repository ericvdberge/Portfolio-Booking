namespace Booking.Domain.Abstractions;

public interface IConfigurablePolicy<TConfig>: IBookingPolicy
{
    static abstract IBookingPolicy FromConfig(TConfig config);
}
