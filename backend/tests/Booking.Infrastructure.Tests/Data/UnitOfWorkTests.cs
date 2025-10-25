using Booking.Infrastructure.Data;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Booking.Infrastructure.Tests.Data;

/// <summary>
/// Unit tests for the UnitOfWork implementation.
/// </summary>
public class UnitOfWorkTests : IDisposable
{
    private readonly BookingDbContext _context;
    private readonly UnitOfWork _unitOfWork;

    public UnitOfWorkTests()
    {
        var options = new DbContextOptionsBuilder<BookingDbContext>()
            .UseInMemoryDatabase(databaseName: $"TestDb_{Guid.NewGuid()}")
            .Options;

        _context = new BookingDbContext(options);
        _unitOfWork = new UnitOfWork(_context);
    }

    [Fact]
    public async Task SaveChangesAsync_WithNoChanges_ReturnsZero()
    {
        // Act
        var result = await _unitOfWork.SaveChangesAsync();

        // Assert
        result.Should().Be(0, "no changes were made to the context");
    }

    [Fact]
    public async Task SaveChangesAsync_WithAddedEntity_ReturnsPositiveNumber()
    {
        // Arrange
        var location = new Domain.Entities.Location(
            "Test Location",
            "123 Test St",
            "A test location",
            100,
            TimeSpan.FromHours(9),
            TimeSpan.FromHours(17)
        );
        _context.Locations.Add(location);

        // Act
        var result = await _unitOfWork.SaveChangesAsync();

        // Assert
        result.Should().BeGreaterThan(0, "an entity was added to the context");
    }

    [Fact]
    public async Task SaveChangesAsync_PersistsChangesToDatabase()
    {
        // Arrange
        var location = new Domain.Entities.Location(
            "Test Location",
            "123 Test St",
            "A test location",
            100,
            TimeSpan.FromHours(9),
            TimeSpan.FromHours(17)
        );
        _context.Locations.Add(location);

        // Act
        await _unitOfWork.SaveChangesAsync();

        // Assert
        var savedLocation = await _context.Locations.FindAsync(location.Id);
        savedLocation.Should().NotBeNull();
        savedLocation!.Name.Should().Be("Test Location");
    }

    [Fact]
    public async Task SaveChangesAsync_WithCancellationToken_RespectsCancellation()
    {
        // Arrange
        var location = new Domain.Entities.Location(
            "Test Location",
            "123 Test St",
            "A test location",
            100,
            TimeSpan.FromHours(9),
            TimeSpan.FromHours(17)
        );
        _context.Locations.Add(location);

        var cancellationTokenSource = new CancellationTokenSource();
        cancellationTokenSource.Cancel();

        // Act
        Func<Task> act = async () => await _unitOfWork.SaveChangesAsync(cancellationTokenSource.Token);

        // Assert
        await act.Should().ThrowAsync<OperationCanceledException>();
    }

    [Fact]
    public async Task SaveChangesAsync_WithMultipleChanges_SavesAllChanges()
    {
        // Arrange
        var location1 = new Domain.Entities.Location("Location 1", "Address 1", "Desc 1", 50, TimeSpan.FromHours(9), TimeSpan.FromHours(17));
        var location2 = new Domain.Entities.Location("Location 2", "Address 2", "Desc 2", 75, TimeSpan.FromHours(10), TimeSpan.FromHours(18));
        var location3 = new Domain.Entities.Location("Location 3", "Address 3", "Desc 3", 100, TimeSpan.FromHours(8), TimeSpan.FromHours(20));

        _context.Locations.AddRange(location1, location2, location3);

        // Act
        var result = await _unitOfWork.SaveChangesAsync();

        // Assert
        result.Should().BeGreaterThan(0);
        var savedLocations = await _context.Locations.ToListAsync();
        savedLocations.Should().HaveCount(3);
    }

    public void Dispose()
    {
        _context?.Dispose();
    }
}
