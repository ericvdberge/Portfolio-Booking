using Booking.Domain.Entities;
using Booking.Domain.Policies.Booking;
using FluentAssertions;
using Xunit;

namespace Booking.Domain.Tests.Policies;

/// <summary>
/// Unit tests for the NoOverlapPolicy to ensure bookings do not overlap with existing bookings.
/// </summary>
public class NoOverlapPolicyTests
{
    [Fact]
    public void CanBook_WhenNoExistingBookings_ReturnsTrue()
    {
        // Arrange
        var policy = new NoOverlapPolicy();
        var location = CreateTestLocation();
        var proposedBooking = new Booking.Domain.Entities.Booking(
            location.Id,
            DateTime.UtcNow.AddDays(1),
            DateTime.UtcNow.AddDays(2)
        );

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeTrue("there are no existing bookings to overlap with");
    }

    [Fact]
    public void CanBook_WhenBookingOverlapsExisting_ReturnsFalse()
    {
        // Arrange
        var policy = new NoOverlapPolicy();
        var location = CreateTestLocation();

        // Add an existing booking
        var existingStart = DateTime.UtcNow.AddDays(1);
        var existingEnd = DateTime.UtcNow.AddDays(3);
        location.Bookings.Add(new Booking.Domain.Entities.Booking(
            location.Id,
            existingStart,
            existingEnd
        ));

        // Proposed booking overlaps in the middle
        var proposedBooking = new Booking.Domain.Entities.Booking(
            location.Id,
            existingStart.AddHours(12),
            existingEnd.AddHours(-12)
        );

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeFalse("the proposed booking overlaps with an existing booking");
    }

    [Fact]
    public void CanBook_WhenBookingStartsBeforeExistingEnds_ReturnsFalse()
    {
        // Arrange
        var policy = new NoOverlapPolicy();
        var location = CreateTestLocation();

        var existingStart = DateTime.UtcNow.AddDays(2);
        var existingEnd = DateTime.UtcNow.AddDays(4);
        location.Bookings.Add(new Booking.Domain.Entities.Booking(
            location.Id,
            existingStart,
            existingEnd
        ));

        // Proposed booking starts before and ends during existing booking
        var proposedBooking = new Booking.Domain.Entities.Booking(
            location.Id,
            DateTime.UtcNow.AddDays(1),
            existingStart.AddHours(12)
        );

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeFalse("the proposed booking overlaps with the existing booking");
    }

    [Fact]
    public void CanBook_WhenBookingEndsExactlyWhenExistingStarts_ReturnsTrue()
    {
        // Arrange
        var policy = new NoOverlapPolicy();
        var location = CreateTestLocation();

        var existingStart = DateTime.UtcNow.AddDays(2);
        var existingEnd = DateTime.UtcNow.AddDays(4);
        location.Bookings.Add(new Booking.Domain.Entities.Booking(
            location.Id,
            existingStart,
            existingEnd
        ));

        // Proposed booking ends exactly when existing starts (no overlap)
        var proposedBooking = new Booking.Domain.Entities.Booking(
            location.Id,
            DateTime.UtcNow.AddDays(1),
            existingStart // Ends exactly when existing starts
        );

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeTrue("bookings that end exactly when another starts do not overlap");
    }

    [Fact]
    public void CanBook_WhenBookingStartsExactlyWhenExistingEnds_ReturnsTrue()
    {
        // Arrange
        var policy = new NoOverlapPolicy();
        var location = CreateTestLocation();

        var existingStart = DateTime.UtcNow.AddDays(1);
        var existingEnd = DateTime.UtcNow.AddDays(2);
        location.Bookings.Add(new Booking.Domain.Entities.Booking(
            location.Id,
            existingStart,
            existingEnd
        ));

        // Proposed booking starts exactly when existing ends (no overlap)
        var proposedBooking = new Booking.Domain.Entities.Booking(
            location.Id,
            existingEnd, // Starts exactly when existing ends
            DateTime.UtcNow.AddDays(3)
        );

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeTrue("bookings that start exactly when another ends do not overlap");
    }

    [Fact]
    public void CanBook_WhenBookingCompletelyAfterExisting_ReturnsTrue()
    {
        // Arrange
        var policy = new NoOverlapPolicy();
        var location = CreateTestLocation();

        var existingStart = DateTime.UtcNow.AddDays(1);
        var existingEnd = DateTime.UtcNow.AddDays(2);
        location.Bookings.Add(new Booking.Domain.Entities.Booking(
            location.Id,
            existingStart,
            existingEnd
        ));

        // Proposed booking is completely after existing
        var proposedBooking = new Booking.Domain.Entities.Booking(
            location.Id,
            DateTime.UtcNow.AddDays(3),
            DateTime.UtcNow.AddDays(4)
        );

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeTrue("the proposed booking is completely after the existing booking");
    }

    [Fact]
    public void CanBook_WhenBookingCompletelyBeforeExisting_ReturnsTrue()
    {
        // Arrange
        var policy = new NoOverlapPolicy();
        var location = CreateTestLocation();

        var existingStart = DateTime.UtcNow.AddDays(3);
        var existingEnd = DateTime.UtcNow.AddDays(4);
        location.Bookings.Add(new Booking.Domain.Entities.Booking(
            location.Id,
            existingStart,
            existingEnd
        ));

        // Proposed booking is completely before existing
        var proposedBooking = new Booking.Domain.Entities.Booking(
            location.Id,
            DateTime.UtcNow.AddDays(1),
            DateTime.UtcNow.AddDays(2)
        );

        // Act
        var result = policy.CanBook(location, proposedBooking);

        // Assert
        result.Should().BeTrue("the proposed booking is completely before the existing booking");
    }

    [Fact]
    public void CanBook_WithMultipleExistingBookings_ValidatesAgainstAll()
    {
        // Arrange
        var policy = new NoOverlapPolicy();
        var location = CreateTestLocation();

        // Add multiple existing bookings
        location.Bookings.Add(new Booking.Domain.Entities.Booking(
            location.Id,
            DateTime.UtcNow.AddDays(1),
            DateTime.UtcNow.AddDays(2)
        ));
        location.Bookings.Add(new Booking.Domain.Entities.Booking(
            location.Id,
            DateTime.UtcNow.AddDays(5),
            DateTime.UtcNow.AddDays(6)
        ));
        location.Bookings.Add(new Booking.Domain.Entities.Booking(
            location.Id,
            DateTime.UtcNow.AddDays(10),
            DateTime.UtcNow.AddDays(11)
        ));

        // Proposed booking fits in a gap between existing bookings
        var validProposedBooking = new Booking.Domain.Entities.Booking(
            location.Id,
            DateTime.UtcNow.AddDays(3),
            DateTime.UtcNow.AddDays(4)
        );

        // Act & Assert
        policy.CanBook(location, validProposedBooking).Should().BeTrue();

        // Proposed booking overlaps with one of the existing bookings
        var invalidProposedBooking = new Booking.Domain.Entities.Booking(
            location.Id,
            DateTime.UtcNow.AddDays(4.5),
            DateTime.UtcNow.AddDays(5.5)
        );

        policy.CanBook(location, invalidProposedBooking).Should().BeFalse();
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
