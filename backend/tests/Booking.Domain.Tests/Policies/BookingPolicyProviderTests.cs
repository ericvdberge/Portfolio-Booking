using Booking.Domain.Entities;
using Booking.Domain.Enums;
using Booking.Domain.Policies;
using Booking.Domain.Policies.Booking;
using FluentAssertions;
using Xunit;

namespace Booking.Domain.Tests.Policies;

/// <summary>
/// Unit tests for the BookingPolicyProvider.
/// </summary>
public class BookingPolicyProviderTests
{
    [Fact]
    public void Create_WithAdvanceNoticePolicyConfig_CreatesAdvanceNoticePolicy()
    {
        // Arrange
        var provider = new BookingPolicyProvider();
        var config = new PolicyConfig
        {
            Id = Guid.NewGuid(),
            Key = Policykey.AdvanceNoticePolicy,
            SettingsJson = """{"AdvanceTime":"2.00:00:00"}""" // 2 days
        };

        // Act
        var policy = provider.Create(config);

        // Assert
        policy.Should().BeOfType<AdvanceNoticePolicy>();
    }

    [Fact]
    public void Create_WithNoOverlapPolicyConfig_CreatesNoOverlapPolicy()
    {
        // Arrange
        var provider = new BookingPolicyProvider();
        var config = new PolicyConfig
        {
            Id = Guid.NewGuid(),
            Key = Policykey.NoOverlapPolicy,
            SettingsJson = """{}"""
        };

        // Act
        var policy = provider.Create(config);

        // Assert
        policy.Should().BeOfType<NoOverlapPolicy>();
    }

    [Fact]
    public void Create_WithGapPolicyConfig_CreatesGapPolicy()
    {
        // Arrange
        var provider = new BookingPolicyProvider();
        var config = new PolicyConfig
        {
            Id = Guid.NewGuid(),
            Key = Policykey.GapPolicy,
            SettingsJson = """{"GapTime":"1.00:00:00"}""" // 1 day
        };

        // Act
        var policy = provider.Create(config);

        // Assert
        policy.Should().BeOfType<GapPolicy>();
    }

    [Fact]
    public void Create_WithOpeningHoursPolicyConfig_CreatesOpeningHoursPolicy()
    {
        // Arrange
        var provider = new BookingPolicyProvider();
        var config = new PolicyConfig
        {
            Id = Guid.NewGuid(),
            Key = Policykey.OpeningHoursPolicy,
            SettingsJson = """{"Open":"09:00:00","Close":"17:00:00"}"""
        };

        // Act
        var policy = provider.Create(config);

        // Assert
        policy.Should().BeOfType<OpeningHoursPolicy>();
    }

    [Fact]
    public void Create_WithMaxDurationPolicyConfig_CreatesMaxDurationPolicy()
    {
        // Arrange
        var provider = new BookingPolicyProvider();
        var config = new PolicyConfig
        {
            Id = Guid.NewGuid(),
            Key = Policykey.MaxDurationPolicy,
            SettingsJson = """{"MaxDuration":"04:00:00"}""" // 4 hours
        };

        // Act
        var policy = provider.Create(config);

        // Assert
        policy.Should().BeOfType<MaxDurationPolicy>();
    }

    [Fact]
    public void Create_AppliesSettingsJsonToPolicy()
    {
        // Arrange
        var provider = new BookingPolicyProvider();
        var config = new PolicyConfig
        {
            Id = Guid.NewGuid(),
            Key = Policykey.AdvanceNoticePolicy,
            SettingsJson = """{"AdvanceTime":"3.00:00:00"}""" // 3 days
        };

        var location = CreateTestLocation();

        // Act
        var policy = provider.Create(config);

        // Test that the policy was configured with 3 days advance notice
        var tooSoonBooking = new Booking.Domain.Entities.Booking(
            location.Id,
            DateTime.UtcNow.AddDays(2), // Only 2 days advance
            DateTime.UtcNow.AddDays(2).AddHours(1));

        var result = policy.CanBook(location, tooSoonBooking);

        // Assert
        result.Should().BeFalse("policy was configured with 3-day advance notice requirement");
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
