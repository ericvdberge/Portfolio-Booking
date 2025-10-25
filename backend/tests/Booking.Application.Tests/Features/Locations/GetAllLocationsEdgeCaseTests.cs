using Booking.Application.Features.Locations.GetAllLocations;
using Booking.Domain.Entities;
using Booking.Domain.Enums;
using Booking.Infrastructure.Repositories;
using FluentAssertions;
using Moq;
using Xunit;

namespace Booking.Application.Tests.Features.Locations;

/// <summary>
/// Additional edge case tests for GetAllLocations to increase coverage.
/// </summary>
public class GetAllLocationsEdgeCaseTests
{
    private readonly Mock<ILocationRepository> _mockLocationRepository;
    private readonly GetAllLocationsQueryHandler _handler;

    public GetAllLocationsEdgeCaseTests()
    {
        _mockLocationRepository = new Mock<ILocationRepository>();
        _handler = new GetAllLocationsQueryHandler(_mockLocationRepository.Object);
    }

    [Fact]
    public async Task HandleAsync_WithEmptyDatabase_ReturnsEmptyList()
    {
        // Arrange
        var query = new GetAllLocationsQuery();
        _mockLocationRepository
            .Setup(repo => repo.GetAllAsync(It.IsAny<LocationFilter?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Location>());

        // Act
        var result = await _handler.HandleAsync(query);

        // Assert
        result.Should().BeEmpty();
    }

    [Fact]
    public async Task HandleAsync_WithSingleLocation_ReturnsSingleDto()
    {
        // Arrange
        var query = new GetAllLocationsQuery();
        var location = CreateTestLocation(Guid.NewGuid(), "Single Location");
        _mockLocationRepository
            .Setup(repo => repo.GetAllAsync(It.IsAny<LocationFilter?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Location> { location });

        // Act
        var result = await _handler.HandleAsync(query);

        // Assert
        result.Should().ContainSingle();
        result.First().Name.Should().Be("Single Location");
    }

    [Fact]
    public async Task HandleAsync_WithLargeNumberOfLocations_ReturnsAllLocations()
    {
        // Arrange
        var query = new GetAllLocationsQuery();
        var locations = Enumerable.Range(1, 100)
            .Select(i => CreateTestLocation(Guid.NewGuid(), $"Location {i}"))
            .ToList();

        _mockLocationRepository
            .Setup(repo => repo.GetAllAsync(It.IsAny<LocationFilter?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(locations);

        // Act
        var result = await _handler.HandleAsync(query);

        // Assert
        result.Should().HaveCount(100);
    }

    [Fact]
    public async Task HandleAsync_MapsAllLocationProperties()
    {
        // Arrange
        var query = new GetAllLocationsQuery();
        var locationId = Guid.NewGuid();
        var location = new Location(
            name: "Comprehensive Hotel",
            address: "456 Full Address St",
            description: "Complete description with all fields",
            capacity: 250,
            openTime: TimeSpan.FromHours(7),
            closeTime: TimeSpan.FromHours(23)
        );

        typeof(Location).GetProperty(nameof(Location.Id))?.SetValue(location, locationId);
        typeof(Location).GetProperty(nameof(Location.LocationType))?.SetValue(location, LocationType.Hotel);
        location.Activate();

        _mockLocationRepository
            .Setup(repo => repo.GetAllAsync(It.IsAny<LocationFilter?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Location> { location });

        // Act
        var result = await _handler.HandleAsync(query);

        // Assert
        var dto = result.Single();
        dto.Id.Should().Be(locationId);
        dto.Name.Should().Be("Comprehensive Hotel");
        dto.Address.Should().Be("456 Full Address St");
        dto.Description.Should().Be("Complete description with all fields");
        dto.Capacity.Should().Be(250);
        dto.OpenTime.Should().Be(TimeSpan.FromHours(7));
        dto.CloseTime.Should().Be(TimeSpan.FromHours(23));
        dto.IsActive.Should().BeTrue();
    }

    [Fact]
    public async Task HandleAsync_WithCancellationToken_PassesTokenToRepository()
    {
        // Arrange
        var query = new GetAllLocationsQuery();
        var cancellationTokenSource = new CancellationTokenSource();
        var cancellationToken = cancellationTokenSource.Token;

        _mockLocationRepository
            .Setup(repo => repo.GetAllAsync(It.IsAny<LocationFilter?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Location>());

        // Act
        await _handler.HandleAsync(query, cancellationToken);

        // Assert
        _mockLocationRepository.Verify(
            repo => repo.GetAllAsync(It.IsAny<LocationFilter?>(), cancellationToken),
            Times.Once);
    }

    [Fact]
    public async Task HandleAsync_PreservesLocationOrder()
    {
        // Arrange
        var query = new GetAllLocationsQuery();
        var location1 = CreateTestLocation(Guid.NewGuid(), "Alpha");
        var location2 = CreateTestLocation(Guid.NewGuid(), "Beta");
        var location3 = CreateTestLocation(Guid.NewGuid(), "Gamma");

        _mockLocationRepository
            .Setup(repo => repo.GetAllAsync(It.IsAny<LocationFilter?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Location> { location1, location2, location3 });

        // Act
        var result = await _handler.HandleAsync(query);

        // Assert
        result.Should().HaveCount(3);
        result.ElementAt(0).Name.Should().Be("Alpha");
        result.ElementAt(1).Name.Should().Be("Beta");
        result.ElementAt(2).Name.Should().Be("Gamma");
    }

    private static Location CreateTestLocation(Guid id, string name)
    {
        var location = new Location(
            name: name,
            address: "123 Test St",
            description: "A test location",
            capacity: 100,
            openTime: TimeSpan.FromHours(9),
            closeTime: TimeSpan.FromHours(17)
        );

        typeof(Location).GetProperty(nameof(Location.Id))?.SetValue(location, id);
        typeof(Location).GetProperty(nameof(Location.LocationType))?.SetValue(location, LocationType.Hotel);

        return location;
    }
}
