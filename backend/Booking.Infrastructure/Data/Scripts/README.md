# Database Scripts

This directory contains database scripts organized by purpose and executed in a specific order:

## Execution Order
1. **Tables/** - Table creation scripts (executed first)
2. **Seed/** - Data seeding scripts (executed after tables)

## Tables/
Contains table creation and schema definition scripts.

### Purpose
- Create database tables with proper constraints
- Add indexes for performance
- Set up triggers and functions
- Define foreign key relationships

### Features
- Automatic UpdatedAt timestamp triggers
- Business rule constraints and validations
- Optimized indexes for common query patterns
- Overlap prevention for bookings

## Seed/
Contains seed data scripts that populate tables with initial data.

### Purpose
- Insert initial/demo data for development and testing
- Provide baseline data for application functionality

## Naming Convention
- Use numerical prefix for execution order: `001_`, `002_`, etc.
- Use descriptive names: `001_CreateLocationTypes.sql`, `001_SeedLocations.sql`
- Scripts should be idempotent (safe to run multiple times)

## Guidelines
- Scripts should check if data/tables already exist before creating/inserting
- Use transactions where appropriate for complex operations
- Include proper error handling with meaningful messages
- Add informative RAISE NOTICE messages for feedback
- Use standard PostgreSQL SQL syntax
- Follow the existing database naming conventions (quoted identifiers)