using Booking.Domain.Enums;
using Booking.Domain.Policies.Booking;
using Booking.Domain.Policies.DefaultPolicyProviders;
using FluentAssertions;
using Xunit;

namespace Booking.Domain.Tests.Policies;

/// <summary>
/// Unit tests for the HotelDefaultPoliciesProvider.
/// </summary>
public class HotelDefaultPoliciesProviderTests
{
    [Fact]
    public void Type_ReturnsHotelLocationType()
    {
        // Arrange
        var provider = new HotelDefaultPoliciesProvider();

        // Act & Assert
        provider.Type.Should().Be(LocationType.Hotel);
    }

    [Fact]
    public void GetDefaults_ReturnsThreePolicies()
    {
        // Arrange
        var provider = new HotelDefaultPoliciesProvider();

        // Act
        var policies = provider.GetDefaults().ToList();

        // Assert
        policies.Should().HaveCount(3);
    }

    [Fact]
    public void GetDefaults_ReturnsAdvanceNoticePolicy()
    {
        // Arrange
        var provider = new HotelDefaultPoliciesProvider();

        // Act
        var policies = provider.GetDefaults().ToList();

        // Assert
        policies.Should().Contain(p => p is AdvanceNoticePolicy);
    }

    [Fact]
    public void GetDefaults_ReturnsGapPolicy()
    {
        // Arrange
        var provider = new HotelDefaultPoliciesProvider();

        // Act
        var policies = provider.GetDefaults().ToList();

        // Assert
        policies.Should().Contain(p => p is GapPolicy);
    }

    [Fact]
    public void GetDefaults_ReturnsNoOverlapPolicy()
    {
        // Arrange
        var provider = new HotelDefaultPoliciesProvider();

        // Act
        var policies = provider.GetDefaults().ToList();

        // Assert
        policies.Should().Contain(p => p is NoOverlapPolicy);
    }

    [Fact]
    public void GetDefaults_ReturnsAllRequiredPolicyTypes()
    {
        // Arrange
        var provider = new HotelDefaultPoliciesProvider();

        // Act
        var policies = provider.GetDefaults().ToList();

        // Assert
        policies.OfType<AdvanceNoticePolicy>().Should().ContainSingle();
        policies.OfType<GapPolicy>().Should().ContainSingle();
        policies.OfType<NoOverlapPolicy>().Should().ContainSingle();
    }
}
