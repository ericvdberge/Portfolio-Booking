namespace Booking.Domain.Abstractions;

public interface IPolicyConfig
{
    public Guid Id { get; }
    public string Name { get; }
    IBookingPolicy ToPolicy();
}
