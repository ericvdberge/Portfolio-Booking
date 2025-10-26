-- Seed data for LocationTypes and Locations tables
-- This script will insert initial data if it doesn't exist

DO $$
DECLARE
    conference_room_type_id UUID;
    creative_space_type_id UUID;
    executive_type_id UUID;
    training_type_id UUID;
    meeting_pod_type_id UUID;
BEGIN
    -- Check if we already have locations
    IF NOT EXISTS (SELECT 1 FROM "Locations") THEN
        -- Insert sample locations
        INSERT INTO "Locations"
        ("Id", "Name", "Address", "Description", "Capacity", "IsActive", "OpenTime", "CloseTime", "LocationType", "CreatedAt", "UpdatedAt")
        VALUES
        (
            gen_random_uuid(),
            'Downtown Conference Room A',
            '123 Business District, Main Street, City Center',
            'Modern conference room with projector, whiteboard, and video conferencing capabilities. Perfect for business meetings and presentations.',
            12,
            true,
            '08:00:00',
            '18:00:00',
            1,
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            'Cozy Countryside B&B',
            '456 Rural Lane, Countryside Village',
            'Charming bed and breakfast with comfortable rooms, homemade breakfast, and peaceful garden views. Perfect for a relaxing getaway.',
            8,
            true,
            '07:00:00',
            '22:00:00',
            2,
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            'Grand Plaza Hotel',
            '789 Corporate Plaza, Executive Lane, Business Park',
            'Luxury hotel with premium amenities, 24/7 concierge service, and state-of-the-art facilities. Designed for business travelers and special occasions.',
            50,
            true,
            '00:00:00',
            '23:59:59',
            1,
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            'Seaside B&B Retreat',
            '321 Coastal Road, Beachfront Area',
            'Intimate bed and breakfast with ocean views, personalized service, and fresh seafood breakfast. Ideal for romantic getaways and beach lovers.',
            6,
            true,
            '07:00:00',
            '22:00:00',
            2,
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            'City Center Business Hotel',
            '654 Innovation Hub, Startup Avenue, Tech District',
            'Modern hotel with business center, meeting rooms, and high-speed internet. Great for business travelers and conference attendees.',
            100,
            true,
            '00:00:00',
            '23:59:59',
            1,
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            'Mountain View B&B',
            '987 Highland Drive, Mountain Village',
            'Rustic bed and breakfast with stunning mountain views, cozy fireplace, and hearty breakfast. Perfect for hikers and nature enthusiasts.',
            10,
            true,
            '06:00:00',
            '23:00:00',
            2,
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Successfully seeded % locations', (SELECT COUNT(*) FROM "Locations");
    ELSE
        RAISE NOTICE 'Locations table already contains data, skipping seed';
    END IF;
END $$;