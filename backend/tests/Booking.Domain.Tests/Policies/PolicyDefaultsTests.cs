using Booking.Domain.Enums;
using Booking.Domain.Policies;
using Booking.Domain.Policies.Booking;
using FluentAssertions;
using Xunit;

namespace Booking.Domain.Tests.Policies;

/// <summary>
/// Unit tests for the PolicyDefaults class.
/// </summary>
public class PolicyDefaultsTests
{
    [Fact]
    public void For_WithHotelLocationType_ReturnsHotelDefaultPolicies()
    {
        // Act
        var policies = PolicyDefaults.For(LocationType.Hotel).ToList();

        // Assert
        policies.Should().NotBeEmpty();
        policies.Should().Contain(p => p is AdvanceNoticePolicy);
        policies.Should().Contain(p => p is GapPolicy);
        policies.Should().Contain(p => p is NoOverlapPolicy);
    }

    [Fact]
    public void For_WithHotelLocationType_ReturnsThreePolicies()
    {
        // Act
        var policies = PolicyDefaults.For(LocationType.Hotel).ToList();

        // Assert
        policies.Should().HaveCount(3, "Hotel location type has 3 default policies");
    }

    [Fact]
    public void For_WithHotelLocationType_ReturnsAdvanceNoticePolicyWith2DayRequirement()
    {
        // Act
        var policies = PolicyDefaults.For(LocationType.Hotel).ToList();
        var advanceNoticePolicy = policies.OfType<AdvanceNoticePolicy>().FirstOrDefault();

        // Assert
        advanceNoticePolicy.Should().NotBeNull();

        // Test the policy to verify it's configured for 2 days
        var location = CreateTestLocation();
        var booking1Day = new Booking.Domain.Entities.Booking(
            location.Id,
            DateTime.UtcNow.AddDays(1),
            DateTime.UtcNow.AddDays(1).AddHours(1));
        var booking3Days = new Booking.Domain.Entities.Booking(
            location.Id,
            DateTime.UtcNow.AddDays(3),
            DateTime.UtcNow.AddDays(3).AddHours(1));

        advanceNoticePolicy!.CanBook(location, booking1Day).Should().BeFalse("requires 2 days advance");
        advanceNoticePolicy.CanBook(location, booking3Days).Should().BeTrue("3 days meets requirement");
    }

    [Fact]
    public void For_WithHotelLocationType_ReturnsGapPolicyWith1DayRequirement()
    {
        // Act
        var policies = PolicyDefaults.For(LocationType.Hotel).ToList();
        var gapPolicy = policies.OfType<GapPolicy>().FirstOrDefault();

        // Assert
        gapPolicy.Should().NotBeNull();
    }

    [Fact]
    public void For_WithHotelLocationType_ReturnsNoOverlapPolicy()
    {
        // Act
        var policies = PolicyDefaults.For(LocationType.Hotel).ToList();
        var noOverlapPolicy = policies.OfType<NoOverlapPolicy>().FirstOrDefault();

        // Assert
        noOverlapPolicy.Should().NotBeNull();
    }

    private static Booking.Domain.Entities.Location CreateTestLocation()
    {
        var location = new Booking.Domain.Entities.Location(
            name: "Test Location",
            address: "123 Test Street",
            description: "A test location",
            capacity: 100,
            openTime: TimeSpan.FromHours(9),
            closeTime: TimeSpan.FromHours(18)
        );

        typeof(Booking.Domain.Entities.Location)
            .GetProperty(nameof(Booking.Domain.Entities.Location.LocationType))?
            .SetValue(location, LocationType.Hotel);

        return location;
    }
}
