using Booking.Domain.Entities;
using Booking.Domain.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Booking.Infrastructure.Repositories;

public class LocationRepository : ILocationRepository
{
    private readonly BookingDbContext _context;
    
    // Dummy data for testing
    private static readonly List<Location> _dummyLocations = new()
    {
        new Location(
            "Downtown Conference Center",
            "123 Business Ave, Downtown",
            "Modern conference center with state-of-the-art facilities",
            200,
            TimeSpan.FromHours(8),
            TimeSpan.FromHours(20)
        ),
        new Location(
            "Riverside Meeting Hall",
            "456 River St, Waterfront District",
            "Elegant meeting hall with scenic river views",
            150,
            TimeSpan.FromHours(9),
            TimeSpan.FromHours(18)
        ),
        new Location(
            "Tech Hub Coworking Space",
            "789 Innovation Blvd, Tech District",
            "Flexible coworking space perfect for tech meetings and events",
            50,
            TimeSpan.FromHours(7),
            TimeSpan.FromHours(22)
        ),
        new Location(
            "Garden Event Pavilion",
            "101 Park Lane, Garden District",
            "Beautiful outdoor pavilion surrounded by gardens",
            100,
            TimeSpan.FromHours(10),
            TimeSpan.FromHours(16)
        ),
        new Location(
            "Executive Boardroom Suite",
            "202 Corporate Plaza, Financial District",
            "Premium boardroom suite for executive meetings",
            25,
            TimeSpan.FromHours(8),
            TimeSpan.FromHours(19)
        )
    };

    public LocationRepository(BookingDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Location>> GetAvailableNowAsync(CancellationToken cancellationToken = default)
    {
        // Use the domain entity's built-in availability logic
        var availableLocations = _dummyLocations
            .Where(l => l.IsAvailableNow())
            .ToList();
            
        return await Task.FromResult(availableLocations);
    }

    public async Task<Location?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var location = _dummyLocations.FirstOrDefault(l => l.Id == id);
        return await Task.FromResult(location);
    }

    public async Task<IEnumerable<Location>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        // For testing purposes, GetAll returns only available locations
        return await GetAvailableNowAsync(cancellationToken);
    }
}