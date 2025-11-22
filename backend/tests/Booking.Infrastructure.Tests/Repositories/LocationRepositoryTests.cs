using Booking.Domain.Entities;
using Booking.Infrastructure.Repositories;
using FluentAssertions;
using Moq;
using Xunit;

namespace Booking.Infrastructure.Tests.Repositories;

/// <summary>
/// Unit tests for the LocationRepository.
/// Note: These are placeholder tests. For comprehensive repository testing,
/// consider using an in-memory database or test containers.
/// </summary>
public class LocationRepositoryTests
{
    [Fact]
    public void ILocationRepository_Interface_HasRequiredMethods()
    {
        // This test verifies that the interface contract is maintained
        var mockRepository = new Mock<ILocationRepository>();

        // Arrange & Act
        var getByIdMethod = typeof(ILocationRepository).GetMethod(nameof(ILocationRepository.GetByIdAsync));
        var getAllMethod = typeof(ILocationRepository).GetMethod(nameof(ILocationRepository.GetAllAsync));
        var addMethod = typeof(ILocationRepository).GetMethod(nameof(ILocationRepository.AddAsync));
        var updateMethod = typeof(ILocationRepository).GetMethod(nameof(ILocationRepository.UpdateAsync));
        var deleteMethod = typeof(ILocationRepository).GetMethod(nameof(ILocationRepository.DeleteAsync));

        // Assert
        getByIdMethod.Should().NotBeNull("GetByIdAsync method should exist");
        getAllMethod.Should().NotBeNull("GetAllAsync method should exist");
        addMethod.Should().NotBeNull("AddAsync method should exist");
        updateMethod.Should().NotBeNull("UpdateAsync method should exist");
        deleteMethod.Should().NotBeNull("DeleteAsync method should exist");
    }

    [Fact]
    public async Task GetAllAsync_CanBeCalledWithoutFilter()
    {
        // Arrange
        var mockRepository = new Mock<ILocationRepository>();
        var expectedLocations = new List<Location>
        {
            new Location("Test Location", "123 Test St", "Description", 10, TimeSpan.FromHours(8), TimeSpan.FromHours(20), "test-org")
        };

        mockRepository
            .Setup(repo => repo.GetAllAsync(null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedLocations);

        // Act
        var result = await mockRepository.Object.GetAllAsync(null, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(1);
    }

    [Fact]
    public async Task GetByIdAsync_CanBeCalled()
    {
        // Arrange
        var mockRepository = new Mock<ILocationRepository>();
        var locationId = Guid.NewGuid();
        var expectedLocation = new Location(
            "Test Location",
            "123 Test St",
            "Description",
            10,
            TimeSpan.FromHours(8),
            TimeSpan.FromHours(20),
            "test-org"
        );

        mockRepository
            .Setup(repo => repo.GetByIdAsync(locationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedLocation);

        // Act
        var result = await mockRepository.Object.GetByIdAsync(locationId, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Should().Be(expectedLocation);
    }

    [Fact]
    public async Task AddAsync_CanBeCalled()
    {
        // Arrange
        var mockRepository = new Mock<ILocationRepository>();
        var newLocation = new Location(
            "New Location",
            "456 New St",
            "New Description",
            20,
            TimeSpan.FromHours(9),
            TimeSpan.FromHours(21),
            "test-org"
        );

        mockRepository
            .Setup(repo => repo.AddAsync(It.IsAny<Location>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(newLocation);

        // Act
        var result = await mockRepository.Object.AddAsync(newLocation, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Should().Be(newLocation);
    }

    // TODO: Add integration tests using an in-memory database or test containers
    // for more comprehensive repository testing.
    // Consider using:
    // - Microsoft.EntityFrameworkCore.InMemory for simple scenarios
    // - Testcontainers for more realistic database testing
}
