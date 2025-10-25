using Booking.Domain.Entities;
using Booking.Domain.Enums;
using FluentAssertions;
using Xunit;
using BookingEntity = Booking.Domain.Entities.Booking;

namespace Booking.Domain.Tests.Policies;

/// <summary>
/// Unit tests for the MaxDurationPolicy.
/// </summary>
public class MaxDurationPolicyTests
{
    [Fact]
    public void CanBook_WhenBookingDurationIsLessThanMax_ReturnsTrue()
    {
        // Arrange
        var maxDuration = TimeSpan.FromHours(4);
        var policy = new MaxDurationPolicy(maxDuration);
        var location = CreateTestLocation();

        var startDate = DateTime.UtcNow.AddDays(3);
        var endDate = startDate.AddHours(2); // 2 hours, less than max
        var proposedBooking = new BookingEntity(location.Id, startDate, endDate);

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeTrue("booking duration is less than maximum allowed");
    }

    [Fact]
    public void CanBook_WhenBookingDurationEqualsMax_ReturnsTrue()
    {
        // Arrange
        var maxDuration = TimeSpan.FromHours(4);
        var policy = new MaxDurationPolicy(maxDuration);
        var location = CreateTestLocation();

        var startDate = DateTime.UtcNow.AddDays(3);
        var endDate = startDate.AddHours(4); // Exactly 4 hours
        var proposedBooking = new BookingEntity(location.Id, startDate, endDate);

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeTrue("booking duration equals maximum allowed");
    }

    [Fact]
    public void CanBook_WhenBookingDurationExceedsMax_ReturnsFalse()
    {
        // Arrange
        var maxDuration = TimeSpan.FromHours(4);
        var policy = new MaxDurationPolicy(maxDuration);
        var location = CreateTestLocation();

        var startDate = DateTime.UtcNow.AddDays(3);
        var endDate = startDate.AddHours(5); // 5 hours, exceeds max
        var proposedBooking = new BookingEntity(location.Id, startDate, endDate);

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeFalse("booking duration exceeds maximum allowed");
    }

    [Fact]
    public void CanBook_WithMultiDayBooking_EnforcesMaxDuration()
    {
        // Arrange
        var maxDuration = TimeSpan.FromDays(2);
        var policy = new MaxDurationPolicy(maxDuration);
        var location = CreateTestLocation();

        var startDate = DateTime.UtcNow.AddDays(3);
        var endDate = startDate.AddDays(3); // 3 days, exceeds 2-day max
        var proposedBooking = new BookingEntity(location.Id, startDate, endDate);

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeFalse("booking duration of 3 days exceeds 2-day maximum");
    }

    [Fact]
    public void Apply_UpdatesMaxDuration()
    {
        // Arrange
        var policy = new MaxDurationPolicy(TimeSpan.FromHours(4));
        var location = CreateTestLocation();
        var settingsJson = """{"MaxDuration":"08:00:00"}"""; // 8 hours

        // Act
        policy.Apply(settingsJson);

        // Test with 6-hour booking (should now be valid)
        var startDate = DateTime.UtcNow.AddDays(3);
        var endDate = startDate.AddHours(6);
        var proposedBooking = new BookingEntity(location.Id, startDate, endDate);
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeTrue("booking is within updated max duration of 8 hours");
    }

    [Fact]
    public void Key_ReturnsMaxDurationPolicyKey()
    {
        // Act & Assert
        MaxDurationPolicy.Key.Should().Be(Policykey.MaxDurationPolicy);
    }

    [Theory]
    [InlineData(1, true)]  // 1 hour booking with 4 hour max
    [InlineData(2, true)]  // 2 hour booking
    [InlineData(3, true)]  // 3 hour booking
    [InlineData(4, true)]  // 4 hour booking (exactly at max)
    [InlineData(5, false)] // 5 hour booking (exceeds max)
    [InlineData(6, false)] // 6 hour booking (exceeds max)
    public void CanBook_WithVariousDurations_ReturnsExpectedResult(int hours, bool expected)
    {
        // Arrange
        var maxDuration = TimeSpan.FromHours(4);
        var policy = new MaxDurationPolicy(maxDuration);
        var location = CreateTestLocation();

        var startDate = DateTime.UtcNow.AddDays(3);
        var endDate = startDate.AddHours(hours);
        var proposedBooking = new BookingEntity(location.Id, startDate, endDate);

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().Be(expected);
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
