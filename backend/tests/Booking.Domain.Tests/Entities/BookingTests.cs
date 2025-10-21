using FluentAssertions;
using Xunit;

namespace Booking.Domain.Tests.Entities;

/// <summary>
/// Unit tests for the Booking entity.
/// </summary>
public class BookingTests
{
    [Fact]
    public void Constructor_CreatesBookingWithCorrectProperties()
    {
        // Arrange
        var locationId = Guid.NewGuid();
        var startDate = DateTime.UtcNow.AddDays(1);
        var endDate = DateTime.UtcNow.AddDays(2);
        var beforeCreation = DateTime.UtcNow;

        // Act
        var booking = new Domain.Entities.Booking(locationId, startDate, endDate);
        var afterCreation = DateTime.UtcNow;

        // Assert
        booking.LocationId.Should().Be(locationId);
        booking.StartDate.Should().Be(startDate);
        booking.EndDate.Should().Be(endDate);
        booking.CreatedAt.Should().BeOnOrAfter(beforeCreation);
        booking.CreatedAt.Should().BeOnOrBefore(afterCreation);
        booking.UpdatedAt.Should().BeOnOrAfter(beforeCreation);
        booking.UpdatedAt.Should().BeOnOrBefore(afterCreation);
        booking.Id.Should().NotBeEmpty("booking should have a generated ID");
    }

    [Fact]
    public void Constructor_GeneratesUniqueIds()
    {
        // Arrange
        var locationId = Guid.NewGuid();
        var startDate = DateTime.UtcNow.AddDays(1);
        var endDate = DateTime.UtcNow.AddDays(2);

        // Act
        var booking1 = new Domain.Entities.Booking(locationId, startDate, endDate);
        var booking2 = new Domain.Entities.Booking(locationId, startDate, endDate);

        // Assert
        booking1.Id.Should().NotBe(booking2.Id, "each booking should have a unique ID");
    }

    [Fact]
    public void Constructor_SetsCreatedAtAndUpdatedAtToSameTime()
    {
        // Arrange
        var locationId = Guid.NewGuid();
        var startDate = DateTime.UtcNow.AddDays(1);
        var endDate = DateTime.UtcNow.AddDays(2);

        // Act
        var booking = new Domain.Entities.Booking(locationId, startDate, endDate);

        // Assert
        booking.CreatedAt.Should().BeCloseTo(booking.UpdatedAt, TimeSpan.FromMilliseconds(10), "on creation, both timestamps should be very close");
    }

    [Theory]
    [InlineData(1, 2)]
    [InlineData(1, 7)]
    [InlineData(5, 10)]
    [InlineData(30, 60)]
    public void Constructor_WithVariousDateRanges_CreatesValidBooking(int startDays, int endDays)
    {
        // Arrange
        var locationId = Guid.NewGuid();
        var startDate = DateTime.UtcNow.AddDays(startDays);
        var endDate = DateTime.UtcNow.AddDays(endDays);

        // Act
        var booking = new Domain.Entities.Booking(locationId, startDate, endDate);

        // Assert
        booking.Should().NotBeNull();
        booking.StartDate.Should().Be(startDate);
        booking.EndDate.Should().Be(endDate);
        booking.LocationId.Should().Be(locationId);
    }
}
