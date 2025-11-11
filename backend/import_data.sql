-- =====================================================
-- Dwed Dream Destination - Essential Database Setup
-- With Your Current Data Migrated
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- REFERENCE / LOOKUP TABLES
-- =====================================================

-- Countries table
CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    iso_code VARCHAR(3) UNIQUE NOT NULL,
    phone_code VARCHAR(10),
    currency_code VARCHAR(3),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- States/Provinces table
CREATE TABLE states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    state_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(country_id, name)
);

-- Cities table
CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state_id UUID REFERENCES states(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(state_id, name)
);

-- =====================================================
-- USER MANAGEMENT (Essential Only)
-- =====================================================

-- User types enum
CREATE TYPE user_role AS ENUM ('guest', 'customer', 'venue_owner', 'event_planner', 'admin');
CREATE TYPE account_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'customer',
    status account_status DEFAULT 'pending_verification',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

-- User profiles
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    date_of_birth DATE,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- VENUE MANAGEMENT
-- =====================================================

-- Venue types lookup table
CREATE TABLE venue_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE venue_status AS ENUM ('active', 'inactive', 'pending_approval', 'suspended');

-- Venues table
CREATE TABLE venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    venue_type_id UUID REFERENCES venue_types(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    status venue_status DEFAULT 'pending_approval',
    min_capacity INTEGER,
    max_capacity INTEGER,
    total_rooms INTEGER,
    featured BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Venue locations
CREATE TABLE venue_locations (
    venue_id UUID PRIMARY KEY REFERENCES venues(id) ON DELETE CASCADE,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city_id UUID REFERENCES cities(id) ON DELETE RESTRICT,
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Venue pricing
CREATE TABLE venue_pricing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    veg_price_per_plate DECIMAL(10, 2),
    non_veg_price_per_plate DECIMAL(10, 2),
    rental_cost DECIMAL(12, 2),
    average_budget_per_100_people DECIMAL(12, 2),
    season VARCHAR(50),
    valid_from DATE,
    valid_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Venue ratings
CREATE TABLE venue_ratings (
    venue_id UUID PRIMARY KEY REFERENCES venues(id) ON DELETE CASCADE,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    rating_1_count INTEGER DEFAULT 0,
    rating_2_count INTEGER DEFAULT 0,
    rating_3_count INTEGER DEFAULT 0,
    rating_4_count INTEGER DEFAULT 0,
    rating_5_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Space types lookup table
CREATE TABLE space_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Venue spaces/areas
CREATE TABLE venue_spaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    space_type_id UUID REFERENCES space_types(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    seating_capacity INTEGER,
    floating_capacity INTEGER,
    area_sqft INTEGER,
    description TEXT,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Amenity categories lookup table
CREATE TABLE amenity_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Amenities lookup table
CREATE TABLE amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES amenity_categories(id) ON DELETE SET NULL,
    name VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Venue amenities
CREATE TABLE venue_amenities (
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (venue_id, amenity_id)
);

-- =====================================================
-- EVENT PLANNER MANAGEMENT
-- =====================================================

-- Planner specializations lookup table
CREATE TABLE planner_specializations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE planner_status AS ENUM ('active', 'inactive', 'pending_approval', 'suspended');

-- Event planners table
CREATE TABLE event_planners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    specialization_id UUID REFERENCES planner_specializations(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    status planner_status DEFAULT 'pending_approval',
    business_name VARCHAR(255),
    business_registration_number VARCHAR(100),
    years_of_experience INTEGER,
    events_planned INTEGER DEFAULT 0,
    why_choose_us TEXT,
    usp TEXT,
    featured BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Planner locations
CREATE TABLE planner_locations (
    planner_id UUID PRIMARY KEY REFERENCES event_planners(id) ON DELETE CASCADE,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city_id UUID REFERENCES cities(id) ON DELETE RESTRICT,
    postal_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Planner pricing
CREATE TABLE planner_pricing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    planner_id UUID REFERENCES event_planners(id) ON DELETE CASCADE,
    starting_price DECIMAL(12, 2),
    average_budget_per_100_people DECIMAL(12, 2),
    package_name VARCHAR(100),
    package_description TEXT,
    valid_from DATE,
    valid_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Planner ratings
CREATE TABLE planner_ratings (
    planner_id UUID PRIMARY KEY REFERENCES event_planners(id) ON DELETE CASCADE,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    rating_1_count INTEGER DEFAULT 0,
    rating_2_count INTEGER DEFAULT 0,
    rating_3_count INTEGER DEFAULT 0,
    rating_4_count INTEGER DEFAULT 0,
    rating_5_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services lookup table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Planner services
CREATE TABLE planner_services (
    planner_id UUID REFERENCES event_planners(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    custom_description TEXT,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (planner_id, service_id)
);

-- =====================================================
-- INSERT INITIAL DATA - YOUR CURRENT DATA MIGRATED
-- =====================================================

-- Insert countries
INSERT INTO countries (name, iso_code, phone_code, currency_code) VALUES
    ('India', 'IND', '+91', 'INR');

-- Insert Indian states
INSERT INTO states (country_id, name, state_code) VALUES
    ((SELECT id FROM countries WHERE iso_code = 'IND'), 'Delhi', 'DL'),
    ((SELECT id FROM countries WHERE iso_code = 'IND'), 'Maharashtra', 'MH'),
    ((SELECT id FROM countries WHERE iso_code = 'IND'), 'Karnataka', 'KA'),
    ((SELECT id FROM countries WHERE iso_code = 'IND'), 'Rajasthan', 'RJ'),
    ((SELECT id FROM countries WHERE iso_code = 'IND'), 'Goa', 'GA'),
    ((SELECT id FROM countries WHERE iso_code = 'IND'), 'Tamil Nadu', 'TN'),
    ((SELECT id FROM countries WHERE iso_code = 'IND'), 'Punjab', 'PB');

-- Insert major cities
INSERT INTO cities (state_id, name) VALUES
    ((SELECT id FROM states WHERE name = 'Delhi'), 'Delhi'),
    ((SELECT id FROM states WHERE name = 'Maharashtra'), 'Mumbai'),
    ((SELECT id FROM states WHERE name = 'Maharashtra'), 'Pune'),
    ((SELECT id FROM states WHERE name = 'Karnataka'), 'Bangalore'),
    ((SELECT id FROM states WHERE name = 'Rajasthan'), 'Jaipur'),
    ((SELECT id FROM states WHERE name = 'Rajasthan'), 'Udaipur'),
    ((SELECT id FROM states WHERE name = 'Goa'), 'Goa'),
    ((SELECT id FROM states WHERE name = 'Tamil Nadu'), 'Chennai'),
    ((SELECT id FROM states WHERE name = 'Punjab'), 'Chandigarh');

-- Insert venue types
INSERT INTO venue_types (name, slug, description, icon) VALUES
    ('5 Star Hotels', '5-star-hotels', 'Luxury 5-star hotel venues', 'hotel-5-star'),
    ('4 Star Hotels', '4-star-hotels', 'Premium hotel venues', 'hotel-4-star'),
    ('Palace & Heritage', 'palace-heritage', 'Royal palaces and heritage properties', 'palace'),
    ('Beach Resort', 'beach-resort', 'Beautiful beachfront venues', 'beach'),
    ('Garden & Lawn', 'garden-lawn', 'Garden and outdoor venues', 'garden'),
    ('Convention Center', 'convention-center', 'Large convention centers', 'convention'),
    ('Banquet Hall', 'banquet-hall', 'Traditional banquet halls', 'banquet'),
    ('Hotel Complex', 'hotel-complex', 'Hotel with multiple banquet options', 'hotel-complex');

-- Insert space types
INSERT INTO space_types (name, description) VALUES
    ('Indoor', 'Air-conditioned indoor spaces'),
    ('Outdoor', 'Open-air outdoor spaces'),
    ('Semi-outdoor', 'Covered outdoor spaces'),
    ('Ballroom', 'Large formal ballroom'),
    ('Banquet Hall', 'Traditional banquet hall'),
    ('Garden', 'Outdoor garden area'),
    ('Beachfront', 'Beachfront area');

-- Insert amenity categories
INSERT INTO amenity_categories (name, description, display_order) VALUES
    ('Parking', 'Parking facilities', 1),
    ('Accommodation', 'Guest room facilities', 2),
    ('Catering', 'Food and beverage services', 3),
    ('Entertainment', 'Entertainment and audio-visual', 4),
    ('Services', 'Additional services', 5),
    ('Facilities', 'General facilities', 6);

-- Insert amenities
INSERT INTO amenities (category_id, name, icon) VALUES
    ((SELECT id FROM amenity_categories WHERE name = 'Parking'), 'Valet Parking', 'parking-valet'),
    ((SELECT id FROM amenity_categories WHERE name = 'Parking'), 'Free Parking', 'parking'),
    ((SELECT id FROM amenity_categories WHERE name = 'Accommodation'), 'Luxury Rooms', 'luxury-room'),
    ((SELECT id FROM amenity_categories WHERE name = 'Accommodation'), 'Guest Rooms', 'guest-room'),
    ((SELECT id FROM amenity_categories WHERE name = 'Catering'), 'In-house Catering', 'catering-inhouse'),
    ((SELECT id FROM amenity_categories WHERE name = 'Catering'), 'Outside Catering Allowed', 'catering-outside'),
    ((SELECT id FROM amenity_categories WHERE name = 'Services'), 'Decorators Available', 'decorator'),
    ((SELECT id FROM amenity_categories WHERE name = 'Services'), 'Wedding Planning', 'wedding-planner'),
    ((SELECT id FROM amenity_categories WHERE name = 'Entertainment'), 'Professional Sound System', 'sound'),
    ((SELECT id FROM amenity_categories WHERE name = 'Entertainment'), 'DJ Available', 'dj'),
    ((SELECT id FROM amenity_categories WHERE name = 'Entertainment'), 'Dance Floor', 'dance'),
    ((SELECT id FROM amenity_categories WHERE name = 'Entertainment'), 'LED Screens', 'led-screen'),
    ((SELECT id FROM amenity_categories WHERE name = 'Facilities'), 'Wi-Fi', 'wifi'),
    ((SELECT id FROM amenity_categories WHERE name = 'Facilities'), 'Power Backup', 'power'),
    ((SELECT id FROM amenity_categories WHERE name = 'Facilities'), 'Central AC', 'ac'),
    ((SELECT id FROM amenity_categories WHERE name = 'Facilities'), 'Bridal Room', 'bridal-room');

-- Insert planner specializations
INSERT INTO planner_specializations (name, slug, description, icon) VALUES
    ('Wedding Planning', 'wedding-planning', 'Complete wedding planning services', 'wedding'),
    ('Corporate Events', 'corporate-events', 'Corporate event specialists', 'corporate'),
    ('Destination Weddings', 'destination-weddings', 'Destination wedding experts', 'destination'),
    ('Luxury Weddings', 'luxury-weddings', 'High-end luxury wedding planners', 'luxury'),
    ('Celebration Events', 'celebration-events', 'Birthdays, anniversaries and parties', 'celebration');

-- Insert common services
INSERT INTO services (name, description, category, icon) VALUES
    ('Full Event Planning', 'Complete end-to-end event planning', 'Planning', 'planning-full'),
    ('Venue Selection', 'Help finding and booking the perfect venue', 'Planning', 'venue'),
    ('Vendor Coordination', 'Managing all vendor relationships', 'Coordination', 'vendor'),
    ('Decor Design', 'Complete decor planning and execution', 'Design', 'decor'),
    ('Catering Management', 'Food and beverage planning', 'Planning', 'catering'),
    ('Entertainment Booking', 'Entertainment and DJ booking', 'Entertainment', 'entertainment'),
    ('Photography Coordination', 'Photography and videography arrangement', 'Coordination', 'photo'),
    ('Guest Management', 'Guest list and accommodation management', 'Coordination', 'guest'),
    ('Transportation', 'Guest transportation arrangements', 'Logistics', 'transport');

-- Create admin user
INSERT INTO users (email, password_hash, role, status, email_verified) VALUES
    ('admin@dweddream.com', '$2b$12$hashedpassword', 'admin', 'active', true);

INSERT INTO user_profiles (user_id, first_name, last_name) VALUES
    ((SELECT id FROM users WHERE email = 'admin@dweddream.com'), 'Admin', 'User');

-- =====================================================
-- INSERT YOUR VENUE DATA
-- =====================================================

-- Royal Palace Wedding Complex
INSERT INTO venues (id, name, slug, description, min_capacity, max_capacity, total_rooms, featured, verified, status) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'Royal Palace Wedding Complex', 'royal-palace-wedding-complex', 'Premier wedding destination with multiple banquet options, state-of-the-art facilities, and expert event management team.', 300, 1600, 25, true, true, 'active');

INSERT INTO venue_locations (venue_id, address_line1, city_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'Premium Location', (SELECT id FROM cities WHERE name = 'Delhi'));

INSERT INTO venue_pricing (venue_id, veg_price_per_plate, non_veg_price_per_plate, rental_cost) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 1200, 1500, 250000);

INSERT INTO venue_spaces (venue_id, space_type_id, name, seating_capacity, floating_capacity) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM space_types WHERE name = 'Ballroom'), 'Grand Crystal Ballroom', 600, 200),
    ('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM space_types WHERE name = 'Banquet Hall'), 'Maharaja Hall', 400, 100),
    ('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM space_types WHERE name = 'Garden'), 'Garden Court', 250, 50);

-- The Grand Celebrations
INSERT INTO venues (id, name, slug, description, min_capacity, max_capacity, total_rooms, featured, verified, status) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'The Grand Celebrations', 'the-grand-celebrations', 'Luxury wedding venue complex overlooking the Arabian Sea, offering world-class facilities and breathtaking views.', 400, 2000, 40, true, true, 'active');

INSERT INTO venue_locations (venue_id, address_line1, city_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Sea Facing Location', (SELECT id FROM cities WHERE name = 'Mumbai'));

INSERT INTO venue_pricing (venue_id, veg_price_per_plate, non_veg_price_per_plate, rental_cost) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 1500, 1800, 350000);

INSERT INTO venue_spaces (venue_id, space_type_id, name, seating_capacity, floating_capacity) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM space_types WHERE name = 'Ballroom'), 'Sea View Ballroom', 750, 250),
    ('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM space_types WHERE name = 'Banquet Hall'), 'Royal Banquet', 450, 150),
    ('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM space_types WHERE name = 'Banquet Hall'), 'Celebration Hall', 300, 100);

-- Bangalore Convention Complex
INSERT INTO venues (id, name, slug, description, min_capacity, max_capacity, total_rooms, featured, verified, status) VALUES
    ('550e8400-e29b-41d4-a716-446655440002', 'Bangalore Convention Complex', 'bangalore-convention-complex', 'Ultra-modern convention complex with versatile spaces and comprehensive facilities for grand celebrations.', 500, 2500, 50, true, true, 'active');

INSERT INTO venue_locations (venue_id, address_line1, city_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440002', 'Central Business District', (SELECT id FROM cities WHERE name = 'Bangalore'));

INSERT INTO venue_pricing (venue_id, veg_price_per_plate, non_veg_price_per_plate, rental_cost) VALUES
    ('550e8400-e29b-41d4-a716-446655440002', 1000, 1300, 400000);

INSERT INTO venue_spaces (venue_id, space_type_id, name, seating_capacity, floating_capacity) VALUES
    ('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM space_types WHERE name = 'Convention Hall'), 'Diamond Convention Hall', 900, 300),
    ('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM space_types WHERE name = 'Banquet Hall'), 'Emerald Banquet', 600, 200),
    ('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM space_types WHERE name = 'Garden'), 'Garden Pavilion', 400, 100);

-- Heritage Palace Resort
INSERT INTO venues (id, name, slug, description, min_capacity, max_capacity, total_rooms, featured, verified, status) VALUES
    ('550e8400-e29b-41d4-a716-446655440003', 'Heritage Palace Resort', 'heritage-palace-resort', 'Authentic Rajasthani palace converted into a luxury wedding destination, offering royal experience with modern comforts.', 400, 2200, 60, true, true, 'active');

INSERT INTO venue_locations (venue_id, address_line1, city_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440003', 'Heritage Location', (SELECT id FROM cities WHERE name = 'Jaipur'));

INSERT INTO venue_pricing (venue_id, veg_price_per_plate, non_veg_price_per_plate, rental_cost) VALUES
    ('550e8400-e29b-41d4-a716-446655440003', 2000, 2500, 350000);

INSERT INTO venue_spaces (venue_id, space_type_id, name, seating_capacity, floating_capacity) VALUES
    ('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM space_types WHERE name = 'Palace Hall'), 'Sheesh Mahal', 550, 150),
    ('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM space_types WHERE name = 'Palace Hall'), 'Durbar Hall', 400, 100),
    ('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM space_types WHERE name = 'Garden'), 'Royal Garden', 750, 250);

-- Simple venues (Green Valley Lawn, Crystal Ballroom, etc.)
INSERT INTO venues (id, name, slug, description, min_capacity, max_capacity, featured, verified, status) VALUES
    ('550e8400-e29b-41d4-a716-446655440004', 'Green Valley Lawn', 'green-valley-lawn', 'Sprawling outdoor lawn venue with lush greenery. Great for day weddings and sangeet ceremonies with ample parking space.', 600, 600, false, true, 'active'),
    ('550e8400-e29b-41d4-a716-446655440005', 'Crystal Ballroom', 'crystal-ballroom', 'Elegant ballroom with state-of-the-art lighting and sound systems. Air-conditioned comfort with exquisite decor options.', 350, 350, false, true, 'active'),
    ('550e8400-e29b-41d4-a716-446655440006', 'Sunset Beach Resort', 'sunset-beach-resort', 'Beachfront venue offering stunning sunset views. Perfect for destination weddings with a mix of indoor and outdoor spaces.', 250, 250, true, true, 'active'),
    ('550e8400-e29b-41d4-a716-446655440007', 'Grand Empire Hotel', 'grand-empire-hotel', 'Five-star hotel with multiple banquet halls. Offers comprehensive wedding packages including catering, decoration, and accommodation.', 1000, 1000, true, true, 'active'),
    ('550e8400-e29b-41d4-a716-446655440008', 'Orchid Garden Pavilion', 'orchid-garden-pavilion', 'Boutique venue surrounded by orchid gardens. Intimate setting perfect for smaller weddings and pre-wedding functions.', 200, 200, false, true, 'active'),
    ('550e8400-e29b-41d4-a716-446655440009', 'Majestic Fort Palace', 'majestic-fort-palace', 'Historic palace venue with breathtaking architecture. Offers a truly royal wedding experience with traditional Rajasthani hospitality.', 450, 450, true, true, 'active'),
    ('550e8400-e29b-41d4-a716-446655440010', 'Metro Convention Hub', 'metro-convention-hub', 'Modern convention center in the heart of the city. Easy accessibility with metro connectivity and contemporary facilities.', 700, 700, false, true, 'active'),
    ('550e8400-e29b-41d4-a716-446655440011', 'Riverside Retreat', 'riverside-retreat', 'Peaceful venue along the river with natural beauty. Offers both covered and open-air spaces for various wedding ceremonies.', 400, 400, false, true, 'active');

-- Insert locations for simple venues
INSERT INTO venue_locations (venue_id, address_line1, city_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440004', 'Green Valley Area', (SELECT id FROM cities WHERE name = 'Pune')),
    ('550e8400-e29b-41d4-a716-446655440005', 'City Center', (SELECT id FROM cities WHERE name = 'Hyderabad')),
    ('550e8400-e29b-41d4-a716-446655440006', 'Beach Road', (SELECT id FROM cities WHERE name = 'Goa')),
    ('550e8400-e29b-41d4-a716-446655440007', 'Business District', (SELECT id FROM cities WHERE name = 'Delhi')),
    ('550e8400-e29b-41d4-a716-446655440008', 'Garden Area', (SELECT id FROM cities WHERE name = 'Bangalore')),
    ('550e8400-e29b-41d4-a716-446655440009', 'Fort Road', (SELECT id FROM cities WHERE name = 'Udaipur')),
    ('550e8400-e29b-41d4-a716-446655440010', 'Metro Station Road', (SELECT id FROM cities WHERE name = 'Mumbai')),
    ('550e8400-e29b-41d4-a716-446655440011', 'Riverside Drive', (SELECT id FROM cities WHERE name = 'Chennai'));

-- Insert pricing for simple venues
INSERT INTO venue_pricing (venue_id, veg_price_per_plate, non_veg_price_per_plate, rental_cost) VALUES
    ('550e8400-e29b-41d4-a716-446655440004', 800, 1000, 150000),
    ('550e8400-e29b-41d4-a716-446655440005', 1500, 1800, 200000),
    ('550e8400-e29b-41d4-a716-446655440006', 2500, 3000, 400000),
    ('550e8400-e29b-41d4-a716-446655440007', 1800, 2200, 500000),
    ('550e8400-e29b-41d4-a716-446655440008', 1200, 1400, 100000),
    ('550e8400-e29b-41d4-a716-446655440009', 3000, 3500, 300000),
    ('550e8400-e29b-41d4-a716-446655440010', 1400, 1600, 250000),
    ('550e8400-e29b-41d4-a716-446655440011', 1100, 1300, 180000);

-- =====================================================
-- INSERT YOUR EVENT PLANNER DATA
-- =====================================================

-- Elite Events Management
INSERT INTO event_planners (id, name, slug, description, events_planned, years_of_experience, featured, verified, status) VALUES
    ('660e8400-e29b-41d4-a716-446655440000', 'Elite Events Management', 'elite-events-management', 'Premier event planning company specializing in weddings and corporate events with over 8 years of experience.', 500, 8, true, true, 'active');

INSERT INTO planner_locations (planner_id, address_line1, city_id) VALUES
    ('660e8400-e29b-41d4-a716-446655440000', 'Corporate Office', (SELECT id FROM cities WHERE name = 'Delhi'));

INSERT INTO planner_pricing (planner_id, starting_price, package_name) VALUES
    ('660e8400-e29b-41d4-a716-446655440000', 150000, 'Premium Wedding Package');

-- Dream Day Planners
INSERT INTO event_planners (id, name, slug, description, events_planned, years_of_experience, featured, verified, status) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 'Dream Day Planners', 'dream-day-planners', 'Specialized in destination and cultural weddings with personalized planning services.', 350, 6, true, true, 'active');

INSERT INTO planner_locations (planner_id, address_line1, city_id) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 'Beach Road Office', (SELECT id FROM cities WHERE name = 'Mumbai'));

INSERT INTO planner_pricing (planner_id, starting_price, package_name) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 200000, 'Destination Wedding Package');

-- Corporate Events Pro
INSERT INTO event_planners (id, name, slug, description, events_planned, years_of_experience, featured, verified, status) VALUES
    ('660e8400-e29b-41d4-a716-446655440002', 'Corporate Events Pro', 'corporate-events-pro', 'Expert corporate event planning with focus on professional networking and business objectives.', 200, 5, false, true, 'active');

INSERT INTO planner_locations (planner_id, address_line1, city_id) VALUES
    ('660e8400-e29b-41d4-a716-446655440002', 'IT Park', (SELECT id FROM cities WHERE name = 'Bangalore'));

INSERT INTO planner_pricing (planner_id, starting_price, package_name) VALUES
    ('660e8400-e29b-41d4-a716-446655440002', 100000, 'Corporate Event Package');

-- Celebration Masters
INSERT INTO event_planners (id, name, slug, description, events_planned, years_of_experience, featured, verified, status) VALUES
    ('660e8400-e29b-41d4-a716-446655440003', 'Celebration Masters', 'celebration-masters', 'Specialized in celebration events with creative themes and memorable experiences.', 400, 7, false, true, 'active');

INSERT INTO planner_locations (planner_id, address_line1, city_id) VALUES
    ('660e8400-e29b-41d4-a716-446655440003', 'City Center', (SELECT id FROM cities WHERE name = 'Chennai'));

INSERT INTO planner_pricing (planner_id, starting_price, package_name) VALUES
    ('660e8400-e29b-41d4-a716-446655440003', 80000, 'Celebration Package');

-- Insert planner services
INSERT INTO planner_services (planner_id, service_id) VALUES
    ('660e8400-e29b-41d4-a716-446655440000', (SELECT id FROM services WHERE name = 'Full Event Planning')),
    ('660e8400-e29b-41d4-a716-446655440000', (SELECT id FROM services WHERE name = 'Venue Selection')),
    ('660e8400-e29b-41d4-a716-446655440000', (SELECT id FROM services WHERE name = 'Vendor Coordination')),
    ('660e8400-e29b-41d4-a716-446655440001', (SELECT id FROM services WHERE name = 'Full Event Planning')),
    ('660e8400-e29b-41d4-a716-446655440001', (SELECT id FROM services WHERE name = 'Destination Planning')),
    ('660e8400-e29b-41d4-a716-446655440001', (SELECT id FROM services WHERE name = 'Guest Management')),
    ('660e8400-e29b-41d4-a716-446655440002', (SELECT id FROM services WHERE name = 'Venue Selection')),
    ('660e8400-e29b-41d4-a716-446655440002', (SELECT id FROM services WHERE name = 'Vendor Coordination')),
    ('660e8400-e29b-41d4-a716-446655440003', (SELECT id FROM services WHERE name = 'Decor Design')),
    ('660e8400-e29b-41d4-a716-446655440003', (SELECT id FROM services WHERE name = 'Entertainment Booking'));

-- =====================================================
-- CREATE ESSENTIAL INDEXES
-- =====================================================

-- Geographic indexes
CREATE INDEX idx_cities_state ON cities(state_id);
CREATE INDEX idx_cities_name ON cities(name);
CREATE INDEX idx_states_country ON states(country_id);

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Venues indexes
CREATE INDEX idx_venues_status ON venues(status);
CREATE INDEX idx_venues_featured ON venues(featured);
CREATE INDEX idx_venues_slug ON venues(slug);
CREATE INDEX idx_venue_locations_city ON venue_locations(city_id);
CREATE INDEX idx_venue_pricing_active ON venue_pricing(venue_id, is_active);

-- Event planners indexes
CREATE INDEX idx_planners_status ON event_planners(status);
CREATE INDEX idx_planners_featured ON event_planners(featured