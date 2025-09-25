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
            'Creative Studio Space',
            '456 Arts Quarter, Creative Avenue, Arts District',
            'Open creative studio with natural lighting, flexible seating arrangements, and presentation equipment. Ideal for workshops and creative sessions.',
            20,
            true,
            '09:00:00',
            '21:00:00',
            1,
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            'Executive Boardroom',
            '789 Corporate Plaza, Executive Lane, Business Park',
            'Premium boardroom with leather chairs, 4K display, and high-end audio system. Designed for executive meetings and important presentations.',
            8,
            true,
            '07:00:00',
            '19:00:00',
            1,
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            'Training Room B',
            '321 Learning Center, Education Street, Training Complex',
            'Spacious training room with modular furniture, multiple screens, and breakout areas. Perfect for workshops, seminars, and team training.',
            25,
            true,
            '08:30:00',
            '17:30:00',
            1,
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            'Small Meeting Pod',
            '654 Innovation Hub, Startup Avenue, Tech District',
            'Intimate meeting space with comfortable seating and basic AV equipment. Great for small team meetings and one-on-ones.',
            4,
            true,
            '08:00:00',
            '20:00:00',
            1,
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Successfully seeded % locations', (SELECT COUNT(*) FROM "Locations");
    ELSE
        RAISE NOTICE 'Locations table already contains data, skipping seed';
    END IF;
END $$;