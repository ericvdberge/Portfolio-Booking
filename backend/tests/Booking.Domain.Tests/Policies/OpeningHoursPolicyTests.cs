using Booking.Domain.Entities;
using Booking.Domain.Enums;
using Booking.Domain.Policies.Booking;
using FluentAssertions;
using Xunit;

namespace Booking.Domain.Tests.Policies;

/// <summary>
/// Unit tests for the OpeningHoursPolicy.
/// </summary>
public class OpeningHoursPolicyTests
{
    [Fact]
    public void CanBook_WhenBookingIsWithinOpeningHours_ReturnsTrue()
    {
        // Arrange
        var openTime = TimeSpan.FromHours(9);  // 9 AM
        var closeTime = TimeSpan.FromHours(17); // 5 PM
        var policy = new OpeningHoursPolicy(openTime, closeTime);
        var location = CreateTestLocation();

        var bookingDate = DateTime.Today.AddDays(3).AddHours(10); // 10 AM, 3 days from now
        var proposedBooking = new Booking(location.Id, bookingDate, bookingDate.AddHours(2));

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeTrue("booking starts within opening hours");
    }

    [Fact]
    public void CanBook_WhenBookingStartsBeforeOpeningTime_ReturnsFalse()
    {
        // Arrange
        var openTime = TimeSpan.FromHours(9);
        var closeTime = TimeSpan.FromHours(17);
        var policy = new OpeningHoursPolicy(openTime, closeTime);
        var location = CreateTestLocation();

        var bookingDate = DateTime.Today.AddDays(3).AddHours(8); // 8 AM, before opening
        var proposedBooking = new Booking(location.Id, bookingDate, bookingDate.AddHours(2));

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeFalse("booking starts before opening time");
    }

    [Fact]
    public void CanBook_WhenBookingEndsAfterClosingTime_ReturnsFalse()
    {
        // Arrange
        var openTime = TimeSpan.FromHours(9);
        var closeTime = TimeSpan.FromHours(17);
        var policy = new OpeningHoursPolicy(openTime, closeTime);
        var location = CreateTestLocation();

        var bookingDate = DateTime.Today.AddDays(3).AddHours(16); // 4 PM start
        var proposedBooking = new Booking(location.Id, bookingDate, bookingDate.AddHours(3)); // Ends at 7 PM

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeFalse("booking ends after closing time");
    }

    [Fact]
    public void CanBook_WhenBookingStartsAtOpeningTime_ReturnsTrue()
    {
        // Arrange
        var openTime = TimeSpan.FromHours(9);
        var closeTime = TimeSpan.FromHours(17);
        var policy = new OpeningHoursPolicy(openTime, closeTime);
        var location = CreateTestLocation();

        var bookingDate = DateTime.Today.AddDays(3).AddHours(9); // Exactly 9 AM
        var proposedBooking = new Booking(location.Id, bookingDate, bookingDate.AddHours(2));

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeTrue("booking starts exactly at opening time");
    }

    [Fact]
    public void CanBook_WhenBookingEndsAtClosingTime_ReturnsTrue()
    {
        // Arrange
        var openTime = TimeSpan.FromHours(9);
        var closeTime = TimeSpan.FromHours(17);
        var policy = new OpeningHoursPolicy(openTime, closeTime);
        var location = CreateTestLocation();

        var bookingDate = DateTime.Today.AddDays(3).AddHours(15); // 3 PM start
        var proposedBooking = new Booking(location.Id, bookingDate, bookingDate.AddHours(2)); // Ends at 5 PM

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeTrue("booking ends exactly at closing time");
    }

    [Fact]
    public void Apply_UpdatesOpenAndCloseTime()
    {
        // Arrange
        var policy = new OpeningHoursPolicy(TimeSpan.FromHours(9), TimeSpan.FromHours(17));
        var location = CreateTestLocation();
        var settingsJson = """{"Open":"08:00:00","Close":"20:00:00"}""";

        // Act
        policy.Apply(settingsJson);

        // Test the policy with new hours
        var bookingDate = DateTime.Today.AddDays(3).AddHours(8).AddMinutes(30); // 8:30 AM
        var proposedBooking = new Booking(location.Id, bookingDate, bookingDate.AddHours(1));
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeTrue("booking is within updated opening hours (8 AM - 8 PM)");
    }

    [Fact]
    public void Key_ReturnsOpeningHoursPolicyKey()
    {
        // Act & Assert
        OpeningHoursPolicy.Key.Should().Be(Policykey.OpeningHoursPolicy);
    }

    private static Location CreateTestLocation()
    {
        var location = new Location(
            name: "Test Location",
            address: "123 Test Street",
            description: "A test location",
            capacity: 100,
            openTime: TimeSpan.FromHours(9),
            closeTime: TimeSpan.FromHours(18)
        );

        typeof(Location).GetProperty(nameof(Location.LocationType))?.SetValue(location, LocationType.Hotel);
        return location;
    }
}
