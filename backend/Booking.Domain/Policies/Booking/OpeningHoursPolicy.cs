using Booking.Domain.Abstractions;
using Booking.Domain.Entities;
using Booking.Domain.Enums;
using System.Text.Json;

namespace Booking.Domain.Policies.Booking;

public class OpeningHoursPolicy(TimeSpan _open, TimeSpan _close) : IBookingPolicy
{
    public static Policykey Key => Policykey.OpeningHoursPolicy;

    public bool CanBook(Location location, Entities.Booking proposedBooking)
    {
        var bookingStart = proposedBooking.StartDate.TimeOfDay;
        var bookingEnd = proposedBooking.StartDate.TimeOfDay;

        return bookingStart >= _open && bookingEnd <= _close;
    }

    public void Apply(string settingsJson)
    {
        var cfg = JsonSerializer.Deserialize<OpeningHoursPolicySettings>(settingsJson)!;
        _open = cfg.Open;
        _close = cfg.Close;
    }
}

public record OpeningHoursPolicySettings(TimeSpan Open, TimeSpan Close);
