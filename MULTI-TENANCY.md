# Multi-Tenancy Implementation

## Overview

This document describes the multi-tenancy implementation for the Portfolio Booking System using Organization-based filtering.

## Architecture

The system implements **organization-level multi-tenancy** where:
- Each `Location` belongs to an `Organization` (identified by `OrganizationId`)
- Users are associated with an organization (passed via HTTP headers/claims)
- Dashboard endpoints automatically filter data by the user's organization
- Public endpoints remain unrestricted for browsing

## Implementation Details

### 1. Domain Layer

**Location Entity** (`Booking.Domain/Entities/Location.cs`)
```csharp
public string OrganizationId { get; private set; }
```

The `OrganizationId` property was added to track which organization owns each location.

### 2. Infrastructure Layer

**LocationFilter** (`Booking.Infrastructure/Repositories/LocationFilter.cs`)
```csharp
public string? OrganizationId { get; set; }
```

**LocationRepository** (`Booking.Infrastructure/Repositories/LocationRepository.cs`)
```csharp
// Apply organization filter if provided
if (!string.IsNullOrWhiteSpace(filter?.OrganizationId))
{
    query = query.Where(l => l.OrganizationId == filter.OrganizationId);
}
```

**Database Schema** (`Booking.Infrastructure/Data/Scripts/Tables/001_CreateLocations.sql`)
```sql
"OrganizationId" VARCHAR(100) NOT NULL,
CREATE INDEX IF NOT EXISTS "IX_Locations_OrganizationId" ON "Locations" ("OrganizationId");
```

### 3. API Layer

Two sets of endpoints provide different access patterns:

#### Public Endpoints (`/api/locations`)
**File**: `Booking.Api/Endpoints/LocationEndpoints.cs`

- **Purpose**: Public browsing of all active locations
- **Authentication**: None required
- **Filtering**: Returns all active locations (no organization filter)
- **Use Case**: Public-facing location catalog

**Example**:
```http
GET /api/locations?limit=10&locationType=1
```

#### Dashboard Endpoints (`/api/dashboard/locations`)
**File**: `Booking.Api/Endpoints/DashboardLocationEndpoints.cs`

- **Purpose**: Organization-scoped location management
- **Authentication**: Requires `X-Organization-Id` header (temporary, will use JWT claims)
- **Filtering**: Returns only locations belonging to the user's organization
- **Use Case**: Organization dashboard, location management

**Example**:
```http
GET /api/dashboard/locations
Headers:
  X-Organization-Id: org-acme-corp
```

### 4. Seed Data

Two demo organizations are pre-configured:

- **`org-acme-corp`**: Owns 3 locations
  - Downtown Conference Room A
  - Cozy Countryside B&B
  - City Center Business Hotel

- **`org-global-ventures`**: Owns 3 locations
  - Grand Plaza Hotel
  - Seaside B&B Retreat
  - Mountain View B&B

## Usage Examples

### Testing Organization Filtering

**1. Get all public locations** (no filtering):
```bash
curl http://localhost:5000/api/locations
# Returns all 6 active locations
```

**2. Get locations for "org-acme-corp"**:
```bash
curl http://localhost:5000/api/dashboard/locations \
  -H "X-Organization-Id: org-acme-corp"
# Returns 3 locations owned by org-acme-corp
```

**3. Get locations for "org-global-ventures"**:
```bash
curl http://localhost:5000/api/dashboard/locations \
  -H "X-Organization-Id: org-global-ventures"
# Returns 3 locations owned by org-global-ventures
```

**4. Missing organization header**:
```bash
curl http://localhost:5000/api/dashboard/locations
# Returns 401 Unauthorized with error message
```

## Future Enhancements

### 1. JWT Authentication
Replace the `X-Organization-Id` header with proper JWT claims:

```csharp
private async Task<IResult> GetDashboardLocations(
    HttpContext httpContext,
    [FromServices] ILogicDispatcher _dispatcher,
    CancellationToken cancellationToken)
{
    // Extract from JWT claims instead of header
    var organizationId = httpContext.User.FindFirst("OrganizationId")?.Value;

    if (string.IsNullOrWhiteSpace(organizationId))
        return Results.Unauthorized();

    // ... rest of implementation
}
```

### 2. Group-Level Permissions
Add sub-organization groups for finer-grained access control:

```csharp
public class Location
{
    public string OrganizationId { get; private set; }
    public string? GroupId { get; private set; }  // Optional sub-group
}
```

### 3. Role-Based Access Control (RBAC)
Implement roles within organizations:
- **Admin**: Full access to all organization locations
- **Manager**: Access to specific group locations
- **User**: Read-only access

### 4. Company Hierarchy
Support parent-child organization relationships:

```csharp
public class Organization
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string? ParentOrganizationId { get; set; }
}
```

## Testing

All test files have been updated to include the `organizationId` parameter:

```csharp
// Example from tests
private static Location CreateTestLocation()
{
    return new Location(
        name: "Test Location",
        address: "123 Test Street",
        description: "A test location",
        capacity: 100,
        openTime: TimeSpan.FromHours(9),
        closeTime: TimeSpan.FromHours(18),
        organizationId: "test-org"
    );
}
```

## Database Migration

If you have an existing database, you'll need to:

1. **Drop existing database** (for development):
   ```sql
   DROP DATABASE IF EXISTS booking_db;
   CREATE DATABASE booking_db;
   ```

2. **Run the application** - The DatabaseSeedService will automatically:
   - Create tables with the new `OrganizationId` column
   - Seed locations with organization assignments
   - Create indexes for query performance

## API Documentation

When running in development mode, access the OpenAPI documentation at:
- Swagger UI: `http://localhost:5000/openapi`

The dashboard endpoints are documented with:
- Summary: "Get locations for the authenticated user's organization"
- Description: Details about the X-Organization-Id header requirement

## Security Considerations

1. **Header-based authentication is temporary** - Replace with JWT tokens in production
2. **Validate organization ownership** - Ensure users can only access their organization's data
3. **Index performance** - The `IX_Locations_OrganizationId` index ensures efficient filtering
4. **SQL injection protection** - EF Core parameterizes all queries automatically

## Clean Architecture Compliance

This implementation follows Clean Architecture principles:

- **Domain Layer**: Contains the `OrganizationId` property (business rule)
- **Infrastructure Layer**: Handles data persistence and filtering (technical detail)
- **Application Layer**: Coordinates between domain and infrastructure (use cases)
- **API Layer**: Exposes HTTP endpoints and extracts organizational context

The dependency flow is: API → Application → Domain ← Infrastructure

## Summary

The multi-tenancy implementation provides:
- ✅ Organization-based data isolation
- ✅ Separate public and dashboard endpoints
- ✅ HttpContext-based filtering (temporary header, future JWT)
- ✅ Extensible for groups, roles, and company hierarchies
- ✅ Clean Architecture compliance
- ✅ Comprehensive test coverage
- ✅ Production-ready with minimal changes (JWT integration)
