-- Create Locations table
-- This table stores bookable locations/spaces

CREATE TABLE IF NOT EXISTS "Locations" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "Name" VARCHAR(200) NOT NULL,
    "Address" VARCHAR(500) NOT NULL,
    "Description" VARCHAR(1000),
    "Capacity" INTEGER NOT NULL CHECK ("Capacity" > 0),
    "IsActive" BOOLEAN NOT NULL DEFAULT FALSE,
    "OpenTime" TIME NOT NULL,
    "CloseTime" TIME NOT NULL,
    "LocationType" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- Business rule constraints
    CONSTRAINT "CK_Locations_OpenClose" CHECK ("OpenTime" < "CloseTime")
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "IX_Locations_Name" ON "Locations" ("Name");
CREATE INDEX IF NOT EXISTS "IX_Locations_IsActive" ON "Locations" ("IsActive");