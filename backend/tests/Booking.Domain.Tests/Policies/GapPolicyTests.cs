using Booking.Domain.Entities;
using Booking.Domain.Enums;
using FluentAssertions;
using Xunit;
using BookingEntity = Booking.Domain.Entities.Booking;

namespace Booking.Domain.Tests.Policies;

/// <summary>
/// Unit tests for the GapPolicy.
/// </summary>
public class GapPolicyTests
{
    [Fact]
    public void CanBook_WhenNoExistingBookings_ReturnsTrue()
    {
        // Arrange
        var gapTime = TimeSpan.FromDays(1);
        var policy = new GapPolicy(gapTime);
        var location = CreateTestLocation();

        var startDate = DateTime.UtcNow.AddDays(3);
        var endDate = startDate.AddHours(2);
        var proposedBooking = new BookingEntity(location.Id, startDate, endDate);

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeTrue("there are no existing bookings to conflict with");
    }

    [Fact]
    public void CanBook_WhenGapIsSufficient_ReturnsTrue()
    {
        // Arrange
        var gapTime = TimeSpan.FromDays(1);
        var policy = new GapPolicy(gapTime);
        var location = CreateTestLocation();
        location.Activate();

        // Create existing booking
        var existingStart = DateTime.UtcNow.AddDays(3);
        var existingEnd = existingStart.AddHours(2);
        location.Book(existingStart, existingEnd);

        // Propose new booking with sufficient gap (2 days after existing)
        var proposedStart = existingEnd.AddDays(2);
        var proposedEnd = proposedStart.AddHours(2);
        var proposedBooking = new BookingEntity(location.Id, proposedStart, proposedEnd);

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeTrue("gap between bookings exceeds required gap time");
    }

    [Fact]
    public void CanBook_WhenGapIsExactlyRequired_ReturnsTrue()
    {
        // Arrange
        var gapTime = TimeSpan.FromDays(1);
        var policy = new GapPolicy(gapTime);
        var location = CreateTestLocation();
        location.Activate();

        // Create existing booking
        var existingStart = DateTime.UtcNow.AddDays(3);
        var existingEnd = existingStart.AddHours(2);
        location.Book(existingStart, existingEnd);

        // Propose new booking with exactly 1 day gap
        var proposedStart = existingEnd.AddDays(1);
        var proposedEnd = proposedStart.AddHours(2);
        var proposedBooking = new BookingEntity(location.Id, proposedStart, proposedEnd);

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeTrue("gap between bookings equals required gap time");
    }

    [Fact]
    public void CanBook_WhenGapIsInsufficient_ReturnsFalse()
    {
        // Arrange
        var gapTime = TimeSpan.FromDays(1);
        var policy = new GapPolicy(gapTime);
        var location = CreateTestLocation();
        location.Activate();

        // Create existing booking
        var existingStart = DateTime.UtcNow.AddDays(3);
        var existingEnd = existingStart.AddHours(2);
        location.Book(existingStart, existingEnd);

        // Propose new booking with insufficient gap (12 hours)
        var proposedStart = existingEnd.AddHours(12);
        var proposedEnd = proposedStart.AddHours(2);
        var proposedBooking = new BookingEntity(location.Id, proposedStart, proposedEnd);

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeFalse("gap between bookings is less than required gap time");
    }

    [Fact]
    public void CanBook_WithMultipleExistingBookings_ChecksMostRecentBooking()
    {
        // Arrange
        var gapTime = TimeSpan.FromDays(1);
        var policy = new GapPolicy(gapTime);
        var location = CreateTestLocation();
        location.Activate();

        // Create multiple existing bookings
        var booking1Start = DateTime.UtcNow.AddDays(3);
        location.Book(booking1Start, booking1Start.AddHours(2));

        var booking2Start = DateTime.UtcNow.AddDays(6);
        var booking2End = booking2Start.AddHours(2);
        location.Book(booking2Start, booking2End);

        // Propose new booking after the most recent one with insufficient gap
        var proposedStart = booking2End.AddHours(12); // Only 12 hours after most recent
        var proposedEnd = proposedStart.AddHours(2);
        var proposedBooking = new BookingEntity(location.Id, proposedStart, proposedEnd);

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeFalse("gap from most recent booking is insufficient");
    }

    [Fact]
    public void Apply_UpdatesGapTime()
    {
        // Arrange
        var policy = new GapPolicy(TimeSpan.FromDays(1));
        var location = CreateTestLocation();
        location.Activate();
        var settingsJson = """{"GapTime":"12:00:00"}"""; // 12 hours

        // Create existing booking
        var existingStart = DateTime.UtcNow.AddDays(3);
        var existingEnd = existingStart.AddHours(2);
        location.Book(existingStart, existingEnd);

        // Act
        policy.Apply(settingsJson);

        // Test with 12-hour gap (should now be valid)
        var proposedStart = existingEnd.AddHours(12);
        var proposedEnd = proposedStart.AddHours(2);
        var proposedBooking = new BookingEntity(location.Id, proposedStart, proposedEnd);
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeTrue("gap equals updated gap time of 12 hours");
    }

    [Fact]
    public void Key_ReturnsGapPolicyKey()
    {
        // Act & Assert
        GapPolicy.Key.Should().Be(Policykey.GapPolicy);
    }

    [Theory]
    [InlineData(6, false)]   // 6 hours gap with 1 day (24h) requirement
    [InlineData(12, false)]  // 12 hours gap
    [InlineData(24, true)]   // 24 hours gap (exactly 1 day)
    [InlineData(36, true)]   // 36 hours gap
    [InlineData(48, true)]   // 48 hours gap
    public void CanBook_WithVariousGaps_ReturnsExpectedResult(int gapHours, bool expected)
    {
        // Arrange
        var gapTime = TimeSpan.FromDays(1); // 24 hours
        var policy = new GapPolicy(gapTime);
        var location = CreateTestLocation();
        location.Activate();

        // Create existing booking
        var existingStart = DateTime.UtcNow.AddDays(3);
        var existingEnd = existingStart.AddHours(2);
        location.Book(existingStart, existingEnd);

        // Propose new booking with specified gap
        var proposedStart = existingEnd.AddHours(gapHours);
        var proposedEnd = proposedStart.AddHours(2);
        var proposedBooking = new BookingEntity(location.Id, proposedStart, proposedEnd);

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
