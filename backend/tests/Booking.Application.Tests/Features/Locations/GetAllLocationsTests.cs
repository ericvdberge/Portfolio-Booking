using Booking.Application.Features.Locations;
using Booking.Domain.Entities;
using Booking.Infrastructure.Repositories;
using FluentAssertions;
using Moq;
using Xunit;

namespace Booking.Application.Tests.Features.Locations;

/// <summary>
/// Unit tests for the GetAllLocations query handler.
/// </summary>
public class GetAllLocationsTests
{
    private readonly Mock<ILocationRepository> _mockLocationRepository;
    private readonly GetAllLocationsHandler _handler;

    public GetAllLocationsTests()
    {
        _mockLocationRepository = new Mock<ILocationRepository>();
        _handler = new GetAllLocationsHandler(_mockLocationRepository.Object);
    }

    [Fact]
    public async Task HandleAsync_WithNoLocations_ReturnsEmptyCollection()
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
        _mockLocationRepository.Verify(
            repo => repo.GetAllAsync(null, It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task HandleAsync_WithMultipleLocations_ReturnsAllLocations()
    {
        // Arrange
        var query = new GetAllLocationsQuery();
        var locations = new List<Location>
        {
            CreateTestLocation("Hotel A", "Address 1"),
            CreateTestLocation("Hotel B", "Address 2"),
            CreateTestLocation("Hotel C", "Address 3")
        };

        _mockLocationRepository
            .Setup(repo => repo.GetAllAsync(It.IsAny<LocationFilter?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(locations);

        // Act
        var result = await _handler.HandleAsync(query);

        // Assert
        result.Should().HaveCount(3);
        result.Should().AllBeOfType<LocationDto>();
    }

    [Fact]
    public async Task HandleAsync_MapsLocationPropertiesToDto()
    {
        // Arrange
        var query = new GetAllLocationsQuery();
        var location = CreateTestLocation("Grand Hotel", "123 Main Street");
        var locations = new List<Location> { location };

        _mockLocationRepository
            .Setup(repo => repo.GetAllAsync(It.IsAny<LocationFilter?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(locations);

        // Act
        var result = (await _handler.HandleAsync(query)).ToList();

        // Assert
        result.Should().HaveCount(1);
        var dto = result.First();
        dto.Id.Should().Be(location.Id);
        dto.Name.Should().Be(location.Name);
        dto.Address.Should().Be(location.Address);
        dto.Description.Should().Be(location.Description);
        dto.Capacity.Should().Be(location.Capacity);
        dto.OpenTime.Should().Be(location.OpenTime);
        dto.CloseTime.Should().Be(location.CloseTime);
    }

    [Fact]
    public async Task HandleAsync_WithFilter_PassesFilterToRepository()
    {
        // Arrange
        var filter = new LocationFilter();
        var query = new GetAllLocationsQuery(filter);
        _mockLocationRepository
            .Setup(repo => repo.GetAllAsync(It.IsAny<LocationFilter?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Location>());

        // Act
        await _handler.HandleAsync(query);

        // Assert
        _mockLocationRepository.Verify(
            repo => repo.GetAllAsync(filter, It.IsAny<CancellationToken>()),
            Times.Once);
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
    public async Task HandleAsync_RepositoryThrowsException_PropagatesException()
    {
        // Arrange
        var query = new GetAllLocationsQuery();
        _mockLocationRepository
            .Setup(repo => repo.GetAllAsync(It.IsAny<LocationFilter?>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new InvalidOperationException("Database error"));

        // Act
        Func<Task> act = async () => await _handler.HandleAsync(query);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Database error");
    }

    [Theory]
    [InlineData(5)]
    [InlineData(10)]
    [InlineData(50)]
    public async Task HandleAsync_WithVariousLocationCounts_ReturnsCorrectCount(int locationCount)
    {
        // Arrange
        var query = new GetAllLocationsQuery();
        var locations = Enumerable.Range(1, locationCount)
            .Select(i => CreateTestLocation($"Hotel {i}", $"Address {i}"))
            .ToList();

        _mockLocationRepository
            .Setup(repo => repo.GetAllAsync(It.IsAny<LocationFilter?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(locations);

        // Act
        var result = await _handler.HandleAsync(query);

        // Assert
        result.Should().HaveCount(locationCount);
    }

    private static Location CreateTestLocation(string name, string address)
    {
        return new Location(
            name: name,
            address: address,
            description: $"Description for {name}",
            capacity: 100,
            openTime: TimeSpan.FromHours(8),
            closeTime: TimeSpan.FromHours(20)
        );
    }
}
