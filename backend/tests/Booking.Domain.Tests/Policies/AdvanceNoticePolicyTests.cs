using Booking.Domain.Entities;
using Booking.Domain.Policies.Booking;
using FluentAssertions;
using Xunit;

namespace Booking.Domain.Tests.Policies;

/// <summary>
/// Unit tests for the AdvanceNoticePolicy to ensure bookings require proper advance notice.
/// </summary>
public class AdvanceNoticePolicyTests
{
    [Fact]
    public void CanBook_WhenBookingIsWithinAdvanceTime_ReturnsFalse()
    {
        // Arrange
        var advanceTime = TimeSpan.FromHours(24);
        var policy = new AdvanceNoticePolicy(advanceTime);
        var location = CreateTestLocation();
        var proposedBooking = new Booking.Domain.Entities.Booking(
            location.Id,
            DateTime.UtcNow.AddHours(12), // Less than 24 hours in advance
            DateTime.UtcNow.AddHours(13)
        );

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeFalse("booking is within the required advance notice period");
    }

    [Fact]
    public void CanBook_WhenBookingMeetsAdvanceTime_ReturnsTrue()
    {
        // Arrange
        var advanceTime = TimeSpan.FromHours(24);
        var policy = new AdvanceNoticePolicy(advanceTime);
        var location = CreateTestLocation();
        var proposedBooking = new Booking.Domain.Entities.Booking(
            location.Id,
            DateTime.UtcNow.AddHours(25), // More than 24 hours in advance
            DateTime.UtcNow.AddHours(26)
        );

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeTrue("booking meets the advance notice requirement");
    }

    [Fact]
    public void CanBook_WhenBookingIsExactlyAtAdvanceTime_ReturnsTrue()
    {
        // Arrange
        var advanceTime = TimeSpan.FromHours(24);
        var policy = new AdvanceNoticePolicy(advanceTime);
        var location = CreateTestLocation();
        var proposedBooking = new Booking.Domain.Entities.Booking(
            location.Id,
            DateTime.UtcNow.Add(advanceTime), // Exactly 24 hours in advance
            DateTime.UtcNow.Add(advanceTime).AddHours(1)
        );

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeTrue("booking is exactly at the advance notice threshold");
    }

    [Fact]
    public void Apply_WithValidSettings_UpdatesAdvanceTime()
    {
        // Arrange
        var initialAdvanceTime = TimeSpan.FromHours(24);
        var policy = new AdvanceNoticePolicy(initialAdvanceTime);
        var newAdvanceTime = TimeSpan.FromHours(48);
        var settingsJson = $$"""{"AdvanceTime":"{{newAdvanceTime}}"}""";
        var location = CreateTestLocation();

        // Act
        policy.Apply(settingsJson);

        // Test the new advance time is applied
        var proposedBooking = new Booking.Domain.Entities.Booking(
            location.Id,
            DateTime.UtcNow.AddHours(36), // Between old (24h) and new (48h) advance time
            DateTime.UtcNow.AddHours(37)
        );
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeFalse("the policy should now require 48 hours advance notice");
    }

    [Theory]
    [InlineData(1)]
    [InlineData(6)]
    [InlineData(12)]
    [InlineData(24)]
    [InlineData(48)]
    [InlineData(72)]
    public void CanBook_WithVariousAdvanceTimes_WorksCorrectly(int advanceHours)
    {
        // Arrange
        var advanceTime = TimeSpan.FromHours(advanceHours);
        var policy = new AdvanceNoticePolicy(advanceTime);
        var location = CreateTestLocation();

        // Act & Assert - booking just before threshold
        var tooSoonBooking = new Booking.Domain.Entities.Booking(
            location.Id,
            DateTime.UtcNow.AddHours(advanceHours - 1),
            DateTime.UtcNow.AddHours(advanceHours)
        );
        policy.CanBook(location, tooSoonBooking).Should().BeFalse();

        // Act & Assert - booking at or after threshold
        var validBooking = new Booking.Domain.Entities.Booking(
            location.Id,
            DateTime.UtcNow.AddHours(advanceHours + 1),
            DateTime.UtcNow.AddHours(advanceHours + 2)
        );
        policy.CanBook(location, validBooking).Should().BeTrue();
    }

    private static Location CreateTestLocation()
    {
        return new Location(
            name: "Test Hotel",
            address: "123 Test St",
            description: "A test hotel",
            capacity: 10,
            openTime: TimeSpan.FromHours(8),
            closeTime: TimeSpan.FromHours(20)
        );
    }
}
