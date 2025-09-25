-- Create Bookings table
-- This table stores booking records for locations

CREATE TABLE IF NOT EXISTS "Bookings" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "LocationId" UUID NOT NULL,
    "StartDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "EndDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Foreign key constraint
    CONSTRAINT "FK_Bookings_Locations" FOREIGN KEY ("LocationId") 
        REFERENCES "Locations"("Id") ON DELETE CASCADE,
        
    -- Business rule constraints
    CONSTRAINT "CK_Bookings_StartEnd" CHECK ("StartDate" < "EndDate"),
    CONSTRAINT "CK_Bookings_FutureStart" CHECK ("StartDate" > NOW() - INTERVAL '1 hour')
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "IX_Bookings_LocationId" ON "Bookings" ("LocationId");
CREATE INDEX IF NOT EXISTS "IX_Bookings_StartDate" ON "Bookings" ("StartDate");
CREATE INDEX IF NOT EXISTS "IX_Bookings_EndDate" ON "Bookings" ("EndDate");
CREATE INDEX IF NOT EXISTS "IX_Bookings_TimeRange" ON "Bookings" ("LocationId", "StartDate", "EndDate");

-- Create composite index for overlap detection
CREATE INDEX IF NOT EXISTS "IX_Bookings_Overlap" ON "Bookings" ("LocationId", "StartDate", "EndDate");