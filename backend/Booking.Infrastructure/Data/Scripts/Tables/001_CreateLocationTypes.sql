-- Create LocationTypes table
-- This table stores different types of locations with their characteristics

CREATE TABLE IF NOT EXISTS "LocationTypes" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "Name" VARCHAR(200) NOT NULL,
    "Description" VARCHAR(1000),
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups by name
CREATE INDEX IF NOT EXISTS "IX_LocationTypes_Name" ON "LocationTypes" ("Name");