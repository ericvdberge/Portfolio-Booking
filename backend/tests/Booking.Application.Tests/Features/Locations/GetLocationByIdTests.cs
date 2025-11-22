using Booking.Application.Features.Locations;
using Booking.Domain.Entities;
using Booking.Domain.Enums;
using Booking.Infrastructure.Repositories;
using FluentAssertions;
using Moq;
using Xunit;

namespace Booking.Application.Tests.Features.Locations;

/// <summary>
/// Unit tests for the GetLocationById query handler.
/// </summary>
public class GetLocationByIdTests
{
    private readonly Mock<ILocationRepository> _mockLocationRepository;
    private readonly GetLocationByIdHandler _handler;

    public GetLocationByIdTests()
    {
        _mockLocationRepository = new Mock<ILocationRepository>();
        _handler = new GetLocationByIdHandler(_mockLocationRepository.Object);
    }

    [Fact]
    public async Task HandleAsync_WhenLocationExists_ReturnsLocationDto()
    {
        // Arrange
        var locationId = Guid.NewGuid();
        var location = CreateTestLocation(locationId, "Grand Hotel");
        var query = new GetLocationByIdQuery(locationId);

        _mockLocationRepository
            .Setup(repo => repo.GetByIdAsync(locationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(location);

        // Act
        var result = await _handler.HandleAsync(query);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(locationId);
        result.Name.Should().Be("Grand Hotel");
        result.Address.Should().Be(location.Address);
        result.Description.Should().Be(location.Description);
        result.Capacity.Should().Be(location.Capacity);
        result.OpenTime.Should().Be(location.OpenTime);
        result.CloseTime.Should().Be(location.CloseTime);
    }

    [Fact]
    public async Task HandleAsync_WhenLocationDoesNotExist_ReturnsNull()
    {
        // Arrange
        var locationId = Guid.NewGuid();
        var query = new GetLocationByIdQuery(locationId);

        _mockLocationRepository
            .Setup(repo => repo.GetByIdAsync(locationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Location?)null);

        // Act
        var result = await _handler.HandleAsync(query);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task HandleAsync_CallsRepositoryWithCorrectId()
    {
        // Arrange
        var locationId = Guid.NewGuid();
        var query = new GetLocationByIdQuery(locationId);

        _mockLocationRepository
            .Setup(repo => repo.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Location?)null);

        // Act
        await _handler.HandleAsync(query);

        // Assert
        _mockLocationRepository.Verify(
            repo => repo.GetByIdAsync(locationId, It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task HandleAsync_WithCancellationToken_PassesTokenToRepository()
    {
        // Arrange
        var locationId = Guid.NewGuid();
        var query = new GetLocationByIdQuery(locationId);
        var cancellationTokenSource = new CancellationTokenSource();
        var cancellationToken = cancellationTokenSource.Token;

        _mockLocationRepository
            .Setup(repo => repo.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Location?)null);

        // Act
        await _handler.HandleAsync(query, cancellationToken);

        // Assert
        _mockLocationRepository.Verify(
            repo => repo.GetByIdAsync(locationId, cancellationToken),
            Times.Once);
    }

    [Fact]
    public async Task HandleAsync_MapsAllPropertiesCorrectly()
    {
        // Arrange
        var locationId = Guid.NewGuid();
        var location = new Location(
            name: "Test Location",
            address: "456 Test Ave",
            description: "A wonderful test location",
            capacity: 75,
            openTime: TimeSpan.FromHours(9),
            closeTime: TimeSpan.FromHours(21),
            organizationId: "test-org"
        );

        // Use reflection to set the Id since it's private set
        typeof(Location).GetProperty(nameof(Location.Id))?.SetValue(location, locationId);

        var query = new GetLocationByIdQuery(locationId);

        _mockLocationRepository
            .Setup(repo => repo.GetByIdAsync(locationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(location);

        // Act
        var result = await _handler.HandleAsync(query);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(locationId);
        result.Name.Should().Be("Test Location");
        result.Address.Should().Be("456 Test Ave");
        result.Description.Should().Be("A wonderful test location");
        result.Capacity.Should().Be(75);
        result.OpenTime.Should().Be(TimeSpan.FromHours(9));
        result.CloseTime.Should().Be(TimeSpan.FromHours(21));
    }

    [Theory]
    [InlineData("Hotel A", "123 Main St")]
    [InlineData("Hotel B", "456 Oak Ave")]
    [InlineData("Resort C", "789 Beach Blvd")]
    public async Task HandleAsync_WithVariousLocations_ReturnsCorrectDto(string name, string address)
    {
        // Arrange
        var locationId = Guid.NewGuid();
        var location = CreateTestLocation(locationId, name, address);
        var query = new GetLocationByIdQuery(locationId);

        _mockLocationRepository
            .Setup(repo => repo.GetByIdAsync(locationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(location);

        // Act
        var result = await _handler.HandleAsync(query);

        // Assert
        result.Should().NotBeNull();
        result!.Name.Should().Be(name);
        result.Address.Should().Be(address);
    }

    private static Location CreateTestLocation(Guid id, string name, string address = "123 Test St")
    {
        var location = new Location(
            name: name,
            address: address,
            description: $"Description for {name}",
            capacity: 100,
            openTime: TimeSpan.FromHours(8),
            closeTime: TimeSpan.FromHours(20),
            organizationId: "test-org"
        );

        // Set Id using reflection
        typeof(Location).GetProperty(nameof(Location.Id))?.SetValue(location, id);

        // Set LocationType using reflection
        typeof(Location).GetProperty(nameof(Location.LocationType))?.SetValue(location, LocationType.Hotel);

        return location;
    }
}
