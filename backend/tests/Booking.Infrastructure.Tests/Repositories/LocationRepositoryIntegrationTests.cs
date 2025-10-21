using Booking.Domain.Entities;
using Booking.Domain.Enums;
using Booking.Infrastructure;
using Booking.Infrastructure.Repositories;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Booking.Infrastructure.Tests.Repositories;

/// <summary>
/// Integration tests for LocationRepository using an in-memory database.
/// </summary>
public class LocationRepositoryIntegrationTests : IDisposable
{
    private readonly BookingDbContext _context;
    private readonly LocationRepository _repository;

    public LocationRepositoryIntegrationTests()
    {
        var options = new DbContextOptionsBuilder<BookingDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new BookingDbContext(options);
        _repository = new LocationRepository(_context);
    }

    [Fact]
    public async Task GetByIdAsync_WhenLocationExists_ReturnsLocation()
    {
        // Arrange
        var location = CreateTestLocation("Test Hotel");
        _context.Locations.Add(location);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetByIdAsync(location.Id);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(location.Id);
        result.Name.Should().Be("Test Hotel");
    }

    [Fact]
    public async Task GetByIdAsync_WhenLocationDoesNotExist_ReturnsNull()
    {
        // Arrange
        var nonExistentId = Guid.NewGuid();

        // Act
        var result = await _repository.GetByIdAsync(nonExistentId);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetByIdAsync_IncludesBookings()
    {
        // Arrange
        var location = CreateTestLocation("Hotel with Bookings");
        location.Activate(); // Make location active for booking
        var booking = location.Book(DateTime.UtcNow.AddDays(3), DateTime.UtcNow.AddDays(4));

        _context.Locations.Add(location);
        await _context.SaveChangesAsync();

        // Clear the context to ensure we're loading from database
        _context.ChangeTracker.Clear();

        // Act
        var result = await _repository.GetByIdAsync(location.Id);

        // Assert
        result.Should().NotBeNull();
        result!.Bookings.Should().ContainSingle();
        result.Bookings.First().Id.Should().Be(booking.Id);
    }

    [Fact]
    public async Task GetAllAsync_WithNoFilter_ReturnsActiveLocationsWithDefaultLimit()
    {
        // Arrange
        var activeLocation1 = CreateTestLocation("Active Hotel 1");
        activeLocation1.Activate();
        var activeLocation2 = CreateTestLocation("Active Hotel 2");
        activeLocation2.Activate();
        var inactiveLocation = CreateTestLocation("Inactive Hotel");

        _context.Locations.AddRange(activeLocation1, activeLocation2, inactiveLocation);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetAllAsync();

        // Assert
        result.Should().HaveCount(2);
        result.Should().OnlyContain(l => l.IsActive);
        result.Should().Contain(l => l.Name == "Active Hotel 1");
        result.Should().Contain(l => l.Name == "Active Hotel 2");
    }

    [Fact]
    public async Task GetAllAsync_WithLimit_ReturnsLimitedResults()
    {
        // Arrange
        for (int i = 1; i <= 10; i++)
        {
            var location = CreateTestLocation($"Hotel {i}");
            location.Activate();
            _context.Locations.Add(location);
        }
        await _context.SaveChangesAsync();

        var filter = new LocationFilter { Limit = 5 };

        // Act
        var result = await _repository.GetAllAsync(filter);

        // Assert
        result.Should().HaveCount(5);
    }

    [Fact]
    public async Task GetAllAsync_OnlyReturnsActiveLocations()
    {
        // Arrange
        var activeLocation = CreateTestLocation("Active Hotel");
        activeLocation.Activate();
        var inactiveLocation1 = CreateTestLocation("Inactive Hotel 1");
        var inactiveLocation2 = CreateTestLocation("Inactive Hotel 2");

        _context.Locations.AddRange(activeLocation, inactiveLocation1, inactiveLocation2);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetAllAsync();

        // Assert
        result.Should().ContainSingle();
        result.First().Name.Should().Be("Active Hotel");
    }

    [Fact]
    public async Task AddAsync_AddsLocationToDatabase()
    {
        // Arrange
        var location = CreateTestLocation("New Hotel");

        // Act
        var result = await _repository.AddAsync(location);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().NotBeEmpty();

        var savedLocation = await _context.Locations.FindAsync(result.Id);
        savedLocation.Should().NotBeNull();
        savedLocation!.Name.Should().Be("New Hotel");
    }

    [Fact]
    public async Task UpdateAsync_UpdatesExistingLocation()
    {
        // Arrange
        var location = CreateTestLocation("Original Name");
        _context.Locations.Add(location);
        await _context.SaveChangesAsync();

        // Clear tracking to simulate a fresh load
        _context.ChangeTracker.Clear();

        var loadedLocation = await _context.Locations.FindAsync(location.Id);

        // Use reflection to change the name since it's private set
        typeof(Location).GetProperty(nameof(Location.Name))!
            .SetValue(loadedLocation, "Updated Name");

        // Act
        var result = await _repository.UpdateAsync(loadedLocation!);

        // Assert
        result.Name.Should().Be("Updated Name");

        var updatedLocation = await _context.Locations.FindAsync(location.Id);
        updatedLocation!.Name.Should().Be("Updated Name");
    }

    [Fact]
    public async Task DeleteAsync_RemovesLocationFromDatabase()
    {
        // Arrange
        var location = CreateTestLocation("To Be Deleted");
        _context.Locations.Add(location);
        await _context.SaveChangesAsync();
        var locationId = location.Id;

        // Act
        await _repository.DeleteAsync(locationId);

        // Assert
        var deletedLocation = await _context.Locations.FindAsync(locationId);
        deletedLocation.Should().BeNull();
    }

    [Fact]
    public async Task DeleteAsync_WhenLocationDoesNotExist_DoesNotThrow()
    {
        // Arrange
        var nonExistentId = Guid.NewGuid();

        // Act
        Func<Task> act = async () => await _repository.DeleteAsync(nonExistentId);

        // Assert
        await act.Should().NotThrowAsync();
    }

    [Fact]
    public async Task GetByIdAsync_WithCancellationToken_RespectsToken()
    {
        // Arrange
        var location = CreateTestLocation("Test Hotel");
        _context.Locations.Add(location);
        await _context.SaveChangesAsync();

        using var cts = new CancellationTokenSource();
        cts.Cancel();

        // Act
        Func<Task> act = async () => await _repository.GetByIdAsync(location.Id, cts.Token);

        // Assert
        await act.Should().ThrowAsync<OperationCanceledException>();
    }

    [Fact]
    public async Task GetAllAsync_WithCancellationToken_RespectsToken()
    {
        // Arrange
        using var cts = new CancellationTokenSource();
        cts.Cancel();

        // Act
        Func<Task> act = async () => await _repository.GetAllAsync(null, cts.Token);

        // Assert
        await act.Should().ThrowAsync<OperationCanceledException>();
    }

    [Fact]
    public async Task AddAsync_WithCancellationToken_RespectsToken()
    {
        // Arrange
        var location = CreateTestLocation("Test Hotel");
        using var cts = new CancellationTokenSource();
        cts.Cancel();

        // Act
        Func<Task> act = async () => await _repository.AddAsync(location, cts.Token);

        // Assert
        await act.Should().ThrowAsync<OperationCanceledException>();
    }

    private static Location CreateTestLocation(string name)
    {
        var location = new Location(
            name: name,
            address: "123 Test St",
            description: $"Description for {name}",
            capacity: 100,
            openTime: TimeSpan.FromHours(8),
            closeTime: TimeSpan.FromHours(20)
        );

        // Set LocationType using reflection for Hotel default policies
        typeof(Location).GetProperty(nameof(Location.LocationType))!
            .SetValue(location, LocationType.Hotel);

        return location;
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}
