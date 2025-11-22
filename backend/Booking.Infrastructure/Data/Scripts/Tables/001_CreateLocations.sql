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
    "OrganizationId" VARCHAR(100) NOT NULL,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- Business rule constraints
    CONSTRAINT "CK_Locations_OpenClose" CHECK ("OpenTime" < "CloseTime")
);

-- Migration: Add OrganizationId column to existing Locations table if it doesn't exist
-- This handles the case where the table was created before the multi-tenancy feature
DO $$
BEGIN
    -- Check if OrganizationId column exists in the Locations table
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'Locations'
          AND column_name = 'OrganizationId'
    ) THEN
        -- Add the OrganizationId column with a default value for existing rows
        ALTER TABLE "Locations" ADD COLUMN "OrganizationId" VARCHAR(100) NOT NULL DEFAULT 'default-org';

        RAISE NOTICE 'Added OrganizationId column to Locations table';
    ELSE
        RAISE NOTICE 'OrganizationId column already exists in Locations table';
    END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "IX_Locations_Name" ON "Locations" ("Name");
CREATE INDEX IF NOT EXISTS "IX_Locations_IsActive" ON "Locations" ("IsActive");

-- Create OrganizationId index conditionally (only if the column exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'Locations'
          AND column_name = 'OrganizationId'
    ) THEN
        CREATE INDEX IF NOT EXISTS "IX_Locations_OrganizationId" ON "Locations" ("OrganizationId");
        RAISE NOTICE 'Created index IX_Locations_OrganizationId';
    END IF;
END $$;

-- Migration: Add Images column to Locations table if it doesn't exist
-- This stores an array of image URLs or data URLs as JSON
DO $$
BEGIN
    -- Check if Images column exists in the Locations table
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'Locations'
          AND column_name = 'Images'
    ) THEN
        -- Add the Images column as JSONB with a default empty array
        ALTER TABLE "Locations" ADD COLUMN "Images" JSONB NOT NULL DEFAULT '[]'::jsonb;

        RAISE NOTICE 'Added Images column to Locations table';
    ELSE
        RAISE NOTICE 'Images column already exists in Locations table';
    END IF;
END $$;