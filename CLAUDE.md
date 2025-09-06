# Portfolio Booking System Architecture

## Overview
This project implements a booking system using Clean Architecture principles with ASP.NET Core, focusing on maintainability, testability, and domain-driven design.

## Architecture Layers

### 1. Booking.Api
- **Pattern**: Minimal APIs with Endpoints
- **Responsibility**: HTTP request/response handling, routing, and API contracts
- **Implementation**: 
  - Uses endpoint-based routing with `IEndpoints` pattern
  - Each feature has its own endpoint class (e.g., `BookingEndpoints`)
  - Handles authentication, authorization, and request validation
  - Maps HTTP requests to application layer commands/queries

### 2. Booking.Application
- **Pattern**: Vertical Slice Architecture
- **Responsibility**: Application logic, use cases, and orchestration
- **Implementation**:
  - Organized by features, not technical layers
  - Each feature operation has its own directory containing all related logic
  - Each operation contains:
    - Query/Command definitions
    - Handlers
    - DTOs/ViewModels
    - Validators (when needed)
    - Mappers (when needed)
  - Example structure:
    ```
    Features/
      Locations/
        GetAllLocations/
          GetAllLocations.cs (Query, Handler, DTOs)
        GetLocationById/
          GetLocationById.cs (Query, Handler)
      Bookings/
        CreateBooking/
          CreateBooking.cs (Command, Handler, Validator)
        GetBooking/
          GetBooking.cs (Query, Handler)
        UpdateBooking/
          UpdateBooking.cs (Command, Handler, Validator)
    ```

### 3. Booking.Infrastructure
- **Pattern**: Repository Pattern with Entity Framework Core
- **Responsibility**: Data access, external integrations, and infrastructure concerns
- **Implementation**:
  - Repository pattern for data access abstraction
  - DbContext for Entity Framework Core operations
  - Unit of Work pattern for transaction management
  - External service integrations (email, payment, etc.)
  - Configuration and dependency injection setup

### 4. Booking.Domain
- **Pattern**: Domain-Driven Design with Policies and Specifications
- **Responsibility**: Business logic, domain entities, and business rules
- **Implementation**:
  - **Domain Entities**: Rich object-oriented models with behavior
  - **Value Objects**: Immutable objects representing domain concepts
  - **Domain Services**: Complex business logic that doesn't belong to a single entity
  - **Policies**: Testable business rule implementations
    - Example: `BookingCancellationPolicy`, `PricingPolicy`
  - **Specifications**: Query criteria and business rule validation
    - Example: `AvailableTimeSlotSpecification`, `ValidBookingSpecification`
  - **Domain Events**: Represent significant business occurrences

## Key Architectural Decisions

### Testability Through Policies and Specifications
- **Policies**: Encapsulate complex business rules in testable classes
  ```csharp
  public interface IBookingPolicy
  {
      PolicyResult CanCreateBooking(Booking booking, BookingContext context);
  }
  ```
- **Specifications**: Define reusable business criteria
  ```csharp
  public class AvailableTimeSlotSpecification : ISpecification<TimeSlot>
  {
      public bool IsSatisfiedBy(TimeSlot timeSlot);
  }
  ```

### Domain-Centric Design
- Business logic resides in domain entities and services
- Rich domain models with behavior, not anemic data containers
- Domain events for loose coupling between bounded contexts

### Vertical Slice Architecture Benefits
- Feature-focused organization reduces cognitive load
- Independent development and deployment of features
- Clear boundaries and reduced coupling between features
- Easier testing and maintenance per feature

## Technology Stack
- **Framework**: ASP.NET Core with Minimal APIs
- **Database**: Entity Framework Core
- **Architecture Patterns**: 
  - Clean Architecture
  - CQRS (Command Query Responsibility Segregation)
  - Repository Pattern
  - Specification Pattern
  - Policy Pattern
  - Vertical Slice Architecture

## Development Guidelines
1. Keep domain logic in domain entities and services
2. Use policies for complex business rules that need extensive testing
3. Implement specifications for reusable query criteria
4. Organize application features vertically by use case
5. Maintain clear separation between layers
6. Follow dependency inversion principle
7. Write comprehensive unit tests for policies and specifications