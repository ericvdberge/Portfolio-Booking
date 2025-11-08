using Booking.Application.Features.Locations.BookLocation;
using Booking.Domain.Entities;
using Booking.Domain.Enums;
using Booking.Infrastructure.Data;
using Booking.Infrastructure.Repositories;
using FluentAssertions;
using Moq;
using Xunit;

namespace Booking.Application.Tests.Features.Locations;

/// <summary>
/// Unit tests for the BookLocation command handler.
/// </summary>
public class BookLocationTests
{
    private readonly Mock<ILocationRepository> _mockLocationRepository;
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly BookLocationCommandHandler _handler;

    public BookLocationTests()
    {
        _mockLocationRepository = new Mock<ILocationRepository>();
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _handler = new BookLocationCommandHandler(
            _mockLocationRepository.Object,
            _mockUnitOfWork.Object);
    }

    [Fact]
    public async Task HandleAsync_WhenLocationExists_CreatesBooking()
    {
        // Arrange
        var locationId = Guid.NewGuid();
        var location = CreateTestLocation(locationId);
        var startTime = DateTime.UtcNow.AddDays(3);
        var endTime = DateTime.UtcNow.AddDays(4);
        var command = new BookLocationCommand(locationId, startTime, endTime);

        _mockLocationRepository
            .Setup(repo => repo.GetByIdAsync(locationId, default))
            .ReturnsAsync(location);

        // Act
        await _handler.HandleAsync(command);

        // Assert
        location.Bookings.Should().ContainSingle();
        location.Bookings.First().StartDate.Should().Be(startTime);
        location.Bookings.First().EndDate.Should().Be(endTime);
    }

    [Fact]
    public async Task HandleAsync_WhenLocationExists_CallsSaveChanges()
    {
        // Arrange
        var locationId = Guid.NewGuid();
        var location = CreateTestLocation(locationId);
        var command = new BookLocationCommand(
            locationId,
            DateTime.UtcNow.AddDays(3),
            DateTime.UtcNow.AddDays(4));

        _mockLocationRepository
            .Setup(repo => repo.GetByIdAsync(locationId, default))
            .ReturnsAsync(location);

        // Act
        await _handler.HandleAsync(command);

        // Assert
        _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task HandleAsync_WhenLocationDoesNotExist_ThrowsKeyNotFoundException()
    {
        // Arrange
        var locationId = Guid.NewGuid();
        var command = new BookLocationCommand(
            locationId,
            DateTime.UtcNow.AddDays(3),
            DateTime.UtcNow.AddDays(4));

        _mockLocationRepository
            .Setup(repo => repo.GetByIdAsync(locationId, default))
            .ReturnsAsync((Location?)null);

        // Act
        Func<Task> act = async () => await _handler.HandleAsync(command);

        // Assert
        await act.Should().ThrowAsync<KeyNotFoundException>();
    }

    [Fact]
    public async Task HandleAsync_WhenLocationDoesNotExist_DoesNotCallSaveChanges()
    {
        // Arrange
        var locationId = Guid.NewGuid();
        var command = new BookLocationCommand(
            locationId,
            DateTime.UtcNow.AddDays(3),
            DateTime.UtcNow.AddDays(4));

        _mockLocationRepository
            .Setup(repo => repo.GetByIdAsync(locationId, default))
            .ReturnsAsync((Location?)null);

        // Act
        try
        {
            await _handler.HandleAsync(command);
        }
        catch (KeyNotFoundException)
        {
            // Expected exception
        }

        // Assert
        _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task HandleAsync_CallsRepositoryWithCorrectLocationId()
    {
        // Arrange
        var locationId = Guid.NewGuid();
        var location = CreateTestLocation(locationId);
        var command = new BookLocationCommand(
            locationId,
            DateTime.UtcNow.AddDays(3),
            DateTime.UtcNow.AddDays(4));

        _mockLocationRepository
            .Setup(repo => repo.GetByIdAsync(It.IsAny<Guid>(), default))
            .ReturnsAsync(location);

        // Act
        await _handler.HandleAsync(command);

        // Assert
        _mockLocationRepository.Verify(
            repo => repo.GetByIdAsync(locationId, default),
            Times.Once);
    }

    [Fact]
    public async Task HandleAsync_WithCancellationToken_PassesTokenToRepository()
    {
        // Arrange
        var locationId = Guid.NewGuid();
        var location = CreateTestLocation(locationId);
        var cancellationTokenSource = new CancellationTokenSource();
        var cancellationToken = cancellationTokenSource.Token;
        var command = new BookLocationCommand(
            locationId,
            DateTime.UtcNow.AddDays(3),
            DateTime.UtcNow.AddDays(4));

        _mockLocationRepository
            .Setup(repo => repo.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(location);

        // Act
        await _handler.HandleAsync(command, cancellationToken);

        // Assert
        _mockLocationRepository.Verify(
            repo => repo.GetByIdAsync(locationId, cancellationToken),
            Times.Once);
    }

    [Fact]
    public async Task HandleAsync_WhenBookingViolatesPolicy_ThrowsInvalidOperationException()
    {
        // Arrange
        var locationId = Guid.NewGuid();
        var location = CreateTestLocation(locationId);

        // Create a booking that violates the 2-day advance notice policy
        var command = new BookLocationCommand(
            locationId,
            DateTime.UtcNow.AddHours(12), // Less than 2 days in advance
            DateTime.UtcNow.AddHours(13));

        _mockLocationRepository
            .Setup(repo => repo.GetByIdAsync(locationId, default))
            .ReturnsAsync(location);

        // Act
        Func<Task> act = async () => await _handler.HandleAsync(command);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>("booking violates advance notice policy");
    }

    [Theory]
    [InlineData(3, 4)]
    [InlineData(5, 7)]
    [InlineData(10, 12)]
    public async Task HandleAsync_WithVariousValidDateRanges_CreatesBookingSuccessfully(int startDays, int endDays)
    {
        // Arrange
        var locationId = Guid.NewGuid();
        var location = CreateTestLocation(locationId);
        var command = new BookLocationCommand(
            locationId,
            DateTime.UtcNow.AddDays(startDays),
            DateTime.UtcNow.AddDays(endDays));

        _mockLocationRepository
            .Setup(repo => repo.GetByIdAsync(locationId, default))
            .ReturnsAsync(location);

        // Act
        await _handler.HandleAsync(command);

        // Assert
        location.Bookings.Should().ContainSingle();
        _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    private static Location CreateTestLocation(Guid id)
    {
        var location = new Location(
            name: "Test Hotel",
            address: "123 Test St",
            description: "A test hotel",
            capacity: 100,
            openTime: TimeSpan.FromHours(8),
            closeTime: TimeSpan.FromHours(20),
            organizationId: "test-org"
        );

        // Set Id using reflection
        typeof(Location).GetProperty(nameof(Location.Id))?.SetValue(location, id);

        // Set LocationType using reflection for Hotel default policies
        typeof(Location).GetProperty(nameof(Location.LocationType))?.SetValue(location, LocationType.Hotel);

        return location;
    }
}
