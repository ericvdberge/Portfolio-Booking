using Booking.Domain.Entities;
using Booking.Domain.Enums;
using Booking.Domain.Policies.Booking;
using FluentAssertions;
using Xunit;

namespace Booking.Domain.Tests.Entities;

/// <summary>
/// Unit tests for the Location entity to validate booking logic and business rules.
/// </summary>
public class LocationTests
{
    [Fact]
    public void Constructor_CreatesLocationWithCorrectProperties()
    {
        // Arrange
        var name = "Grand Hotel";
        var address = "123 Main St";
        var description = "A luxurious hotel";
        var capacity = 50;
        var openTime = TimeSpan.FromHours(8);
        var closeTime = TimeSpan.FromHours(22);

        // Act
        var location = new Location(name, address, description, capacity, openTime, closeTime);

        // Assert
        location.Name.Should().Be(name);
        location.Address.Should().Be(address);
        location.Description.Should().Be(description);
        location.Capacity.Should().Be(capacity);
        location.OpenTime.Should().Be(openTime);
        location.CloseTime.Should().Be(closeTime);
        location.IsActive.Should().BeFalse("new locations should be inactive by default");
        location.Bookings.Should().BeEmpty();
        location.PolicyConfigs.Should().BeEmpty();
        location.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
        location.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void Activate_SetsIsActiveToTrue()
    {
        // Arrange
        var location = CreateTestLocation();
        location.IsActive.Should().BeFalse();

        // Act
        location.Activate();

        // Assert
        location.IsActive.Should().BeTrue();
    }

    [Fact]
    public void Book_WithValidDateRange_AddsBookingToLocation()
    {
        // Arrange
        var location = CreateTestLocation();
        // Hotel requires 2 days advance notice
        var startDate = DateTime.UtcNow.AddDays(3);
        var endDate = DateTime.UtcNow.AddDays(4);

        // Act
        var booking = location.Book(startDate, endDate);

        // Assert
        booking.Should().NotBeNull();
        booking.LocationId.Should().Be(location.Id);
        booking.StartDate.Should().Be(startDate);
        booking.EndDate.Should().Be(endDate);
        location.Bookings.Should().ContainSingle();
        location.Bookings.Should().Contain(booking);
    }

    [Fact]
    public void Book_WhenOverlappingWithExistingBooking_ThrowsInvalidOperationException()
    {
        // Arrange
        var location = CreateTestLocation();

        // Add an existing booking (2 days advance notice required)
        var existingStart = DateTime.UtcNow.AddDays(3);
        var existingEnd = DateTime.UtcNow.AddDays(5);
        location.Book(existingStart, existingEnd);

        // Try to book overlapping dates (would overlap with existing)
        var overlappingStart = DateTime.UtcNow.AddDays(4);
        var overlappingEnd = DateTime.UtcNow.AddDays(6);

        // Act
        Action act = () => location.Book(overlappingStart, overlappingEnd);

        // Assert
        act.Should().Throw<InvalidOperationException>("the booking overlaps with an existing booking");
        location.Bookings.Should().HaveCount(1, "the overlapping booking should not be added");
    }

    [Fact]
    public void Book_WithMultipleNonOverlappingBookings_AddsAllBookings()
    {
        // Arrange
        var location = CreateTestLocation();

        // Act - Hotel requires 2 days advance notice and 1 day gap between bookings
        var booking1 = location.Book(DateTime.UtcNow.AddDays(3), DateTime.UtcNow.AddDays(4));
        var booking2 = location.Book(DateTime.UtcNow.AddDays(6), DateTime.UtcNow.AddDays(7)); // 1 day gap after booking1
        var booking3 = location.Book(DateTime.UtcNow.AddDays(9), DateTime.UtcNow.AddDays(10)); // 1 day gap after booking2

        // Assert
        location.Bookings.Should().HaveCount(3);
        location.Bookings.Should().Contain(new[] { booking1, booking2, booking3 });
    }

    [Fact]
    public void Book_WithRequiredGapBetweenBookings_RespectsGapPolicy()
    {
        // Arrange
        var location = CreateTestLocation();

        // Act - Hotel requires 1 day gap between bookings
        var booking1 = location.Book(DateTime.UtcNow.AddDays(3), DateTime.UtcNow.AddDays(4));
        var booking2 = location.Book(DateTime.UtcNow.AddDays(6), DateTime.UtcNow.AddDays(7)); // 1 day gap (day 5 is free)

        // Assert
        location.Bookings.Should().HaveCount(2);
        location.Bookings.Should().Contain(new[] { booking1, booking2 });
    }

    [Fact]
    public void Book_CreatesBookingWithCorrectTimestamps()
    {
        // Arrange
        var location = CreateTestLocation();
        // Hotel requires 2 days advance notice
        var startDate = DateTime.UtcNow.AddDays(3);
        var endDate = DateTime.UtcNow.AddDays(4);
        var beforeBooking = DateTime.UtcNow;

        // Act
        var booking = location.Book(startDate, endDate);
        var afterBooking = DateTime.UtcNow;

        // Assert
        booking.CreatedAt.Should().BeOnOrAfter(beforeBooking);
        booking.CreatedAt.Should().BeOnOrBefore(afterBooking);
        booking.UpdatedAt.Should().BeOnOrAfter(beforeBooking);
        booking.UpdatedAt.Should().BeOnOrBefore(afterBooking);
    }

    private static Location CreateTestLocation()
    {
        var location = new Location(
            name: "Test Location",
            address: "123 Test Street",
            description: "A test location for unit tests",
            capacity: 100,
            openTime: TimeSpan.FromHours(9),
            closeTime: TimeSpan.FromHours(18)
        );

        // Set LocationType using reflection since the constructor doesn't set it
        // This ensures the location has default policies (Hotel) for testing
        var locationTypeProperty = typeof(Location).GetProperty(nameof(Location.LocationType));
        locationTypeProperty?.SetValue(location, LocationType.Hotel);

        return location;
    }
}
