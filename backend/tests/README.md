# Backend Unit Tests

This directory contains comprehensive unit tests for the Portfolio Booking System backend, organized following Clean Architecture principles.

## Test Projects

### Booking.Domain.Tests
Tests for domain entities, value objects, policies, and specifications.

**Key Test Areas:**
- **Policies**: Business rule implementations (e.g., `AdvanceNoticePolicy`, `NoOverlapPolicy`)
- **Entities**: Domain models (e.g., `Location`, `Booking`)
- **Value Objects**: Immutable domain concepts
- **Specifications**: Query criteria and business rule validation

### Booking.Application.Tests
Tests for application layer use cases, handlers, and DTOs.

**Key Test Areas:**
- **Query Handlers**: Read operations (e.g., `GetAllLocationsHandler`)
- **Command Handlers**: Write operations (e.g., `CreateBookingHandler`)
- **Validators**: Input validation logic
- **Mappers**: DTO transformations

### Booking.Infrastructure.Tests
Tests for infrastructure concerns, repositories, and external integrations.

**Key Test Areas:**
- **Repositories**: Data access implementations
- **Database Context**: EF Core configurations
- **External Services**: Third-party integrations

## Testing Stack

- **Test Framework**: xUnit 2.9.2
- **Mocking**: Moq 4.20.72
- **Assertions**: FluentAssertions 7.0.0
- **Code Coverage**: Coverlet 6.0.2

## Running Tests Locally

### Run All Tests
```bash
cd backend
dotnet test
```

### Run Tests with Coverage
```bash
cd backend
dotnet test \
  --collect:"XPlat Code Coverage" \
  --results-directory ./TestResults \
  -- DataCollectionRunSettings.DataCollectors.DataCollector.Configuration.Format=opencover
```

### Run Tests for a Specific Project
```bash
cd backend
dotnet test tests/Booking.Domain.Tests
dotnet test tests/Booking.Application.Tests
dotnet test tests/Booking.Infrastructure.Tests
```

### Generate HTML Coverage Report
```bash
cd backend

# Run tests with coverage
dotnet test --collect:"XPlat Code Coverage" --results-directory ./TestResults

# Install ReportGenerator (if not already installed)
dotnet tool install -g dotnet-reportgenerator-globaltool

# Generate report
reportgenerator \
  -reports:"TestResults/**/coverage.opencover.xml" \
  -targetdir:"CoverageReport" \
  -reporttypes:Html

# Open the report
open CoverageReport/index.html  # macOS
xdg-open CoverageReport/index.html  # Linux
start CoverageReport/index.html  # Windows
```

## Test Organization

Tests are organized to mirror the structure of the code they test:

```
tests/
├── Booking.Domain.Tests/
│   ├── Entities/
│   │   ├── BookingTests.cs
│   │   └── LocationTests.cs
│   └── Policies/
│       ├── AdvanceNoticePolicyTests.cs
│       └── NoOverlapPolicyTests.cs
├── Booking.Application.Tests/
│   └── Features/
│       └── Locations/
│           └── GetAllLocationsTests.cs
└── Booking.Infrastructure.Tests/
    └── Repositories/
        └── LocationRepositoryTests.cs
```

## Writing Tests

### Test Naming Convention
Follow the pattern: `MethodName_StateUnderTest_ExpectedBehavior`

**Examples:**
- `CanBook_WhenBookingOverlapsExisting_ReturnsFalse`
- `HandleAsync_WithNoLocations_ReturnsEmptyCollection`
- `Constructor_CreatesLocationWithCorrectProperties`

### Test Structure (AAA Pattern)
```csharp
[Fact]
public void MethodName_StateUnderTest_ExpectedBehavior()
{
    // Arrange - Set up test data and dependencies
    var policy = new AdvanceNoticePolicy(TimeSpan.FromHours(24));
    var booking = new Booking(/* ... */);

    // Act - Execute the method under test
    var result = policy.CanBook(location, booking);

    // Assert - Verify the expected outcome
    result.Should().BeFalse();
}
```

### Using FluentAssertions
```csharp
// Basic assertions
result.Should().BeTrue();
result.Should().BeFalse();
result.Should().NotBeNull();

// Collection assertions
collection.Should().HaveCount(3);
collection.Should().BeEmpty();
collection.Should().Contain(item);

// String assertions
text.Should().Be("expected");
text.Should().StartWith("prefix");

// Exception assertions
Action act = () => method();
act.Should().Throw<InvalidOperationException>()
   .WithMessage("error message");
```

### Using Moq for Mocking
```csharp
// Create a mock
var mockRepository = new Mock<ILocationRepository>();

// Setup method behavior
mockRepository
    .Setup(repo => repo.GetAllAsync(It.IsAny<LocationFilter?>(), It.IsAny<CancellationToken>()))
    .ReturnsAsync(locations);

// Verify method was called
mockRepository.Verify(
    repo => repo.GetAllAsync(null, It.IsAny<CancellationToken>()),
    Times.Once);
```

## CI/CD Integration

Tests are automatically run on every pull request via GitHub Actions:

1. **Build**: Solution is built in Release configuration
2. **Test**: All tests are executed with code coverage collection
3. **Coverage Report**: Generated using ReportGenerator
4. **PR Comment**: Coverage results are posted as a PR comment
5. **Threshold Check**: Coverage is validated against a 60% threshold

### Coverage Thresholds
- 🟢 **Good**: ≥ 80% coverage
- 🟡 **Moderate**: 60-79% coverage
- 🔴 **Low**: < 60% coverage (triggers warning)

## Best Practices

1. **Test One Thing**: Each test should verify a single behavior
2. **Keep Tests Simple**: Tests should be easy to read and understand
3. **Use Descriptive Names**: Test names should clearly describe what is being tested
4. **Avoid Test Interdependence**: Tests should not depend on each other
5. **Mock External Dependencies**: Use mocks for repositories, external services, etc.
6. **Test Edge Cases**: Include tests for boundary conditions and error scenarios
7. **Use Theory for Similar Tests**: Use `[Theory]` with `[InlineData]` for parameterized tests

## Code Coverage Goals

- **Domain Layer**: Aim for 90%+ coverage (business logic is critical)
- **Application Layer**: Aim for 80%+ coverage (orchestration and validation)
- **Infrastructure Layer**: Aim for 70%+ coverage (integration points)

## Troubleshooting

### Tests Not Discovered
```bash
# Clear the test cache
dotnet test --no-build --list-tests
```

### Coverage Report Not Generated
```bash
# Ensure coverlet.collector is installed
dotnet add package coverlet.collector

# Verify coverage files are created
ls -la TestResults/**/coverage.*.xml
```

### Build Failures
```bash
# Restore and rebuild
dotnet clean
dotnet restore
dotnet build
```

## Additional Resources

- [xUnit Documentation](https://xunit.net/)
- [Moq Documentation](https://github.com/moq/moq4)
- [FluentAssertions Documentation](https://fluentassertions.com/)
- [Coverlet Documentation](https://github.com/coverlet-coverage/coverlet)
