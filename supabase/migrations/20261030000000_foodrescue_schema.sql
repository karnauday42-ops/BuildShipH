-- ====================================================================
-- FoodRescue AI — Smart Surplus Food Management Platform
-- Complete Production PostgreSQL Schema & Migration
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DROP TABLES IF RE-RUNNING
DROP TABLE IF EXISTS impact_records CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS ai_advisories CASCADE;
DROP TABLE IF EXISTS donation_requests CASCADE;
DROP TABLE IF EXISTS food_listings CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;

-- 3. PROFILES TABLE
-- Integrates with Supabase Auth auth.users, with strict role validation
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('donor', 'recipient', 'admin')),
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for lookup
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- 4. ORGANIZATIONS TABLE
-- Recipient organizations (and donor corporate entities)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    organization_name TEXT NOT NULL,
    organization_type TEXT NOT NULL CHECK (organization_type IN ('food_bank', 'ngo', 'community_kitchen', 'shelter', 'restaurant_group', 'grocery_chain', 'other')),
    registration_number TEXT,
    description TEXT,
    address TEXT NOT NULL,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'suspended')),
    verification_document_url TEXT,
    capacity_kg NUMERIC NOT NULL DEFAULT 0 CHECK (capacity_kg >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_organizations_owner ON organizations(owner_id);
CREATE INDEX idx_organizations_status ON organizations(verification_status);
CREATE INDEX idx_organizations_coords ON organizations(latitude, longitude);

-- 5. FOOD_LISTINGS TABLE
CREATE TABLE food_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    food_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'Cooked Meals',
        'Bakery Products',
        'Fruits',
        'Vegetables',
        'Dairy Products',
        'Packaged Food',
        'Grains and Cereals',
        'Other'
    )),
    description TEXT,
    quantity NUMERIC NOT NULL CHECK (quantity > 0),
    remaining_quantity NUMERIC NOT NULL CHECK (remaining_quantity >= 0 AND remaining_quantity <= quantity),
    quantity_unit TEXT NOT NULL CHECK (quantity_unit IN ('kg', 'portions', 'items', 'boxes', 'liters')),
    preparation_time TIMESTAMPTZ,
    best_before_time TIMESTAMPTZ,
    storage_condition TEXT NOT NULL CHECK (storage_condition IN ('ambient', 'refrigerated', 'frozen', 'hot_holding', 'dry_storage')),
    storage_temperature NUMERIC,
    pickup_address TEXT NOT NULL,
    pickup_latitude DOUBLE PRECISION,
    pickup_longitude DOUBLE PRECISION,
    pickup_start_time TIMESTAMPTZ NOT NULL,
    pickup_end_time TIMESTAMPTZ NOT NULL,
    vegetarian BOOLEAN NOT NULL DEFAULT FALSE,
    allergens TEXT[] NOT NULL DEFAULT '{}',
    packaging_status TEXT NOT NULL DEFAULT 'sealed_containers',
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN (
        'draft',
        'available',
        'reserved',
        'partially_reserved',
        'completed',
        'expired',
        'cancelled'
    )),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_pickup_window CHECK (pickup_end_time > pickup_start_time)
);

CREATE INDEX idx_food_listings_donor ON food_listings(donor_id);
CREATE INDEX idx_food_listings_status ON food_listings(status);
CREATE INDEX idx_food_listings_category ON food_listings(category);
CREATE INDEX idx_food_listings_pickup_window ON food_listings(pickup_start_time, pickup_end_time);
CREATE INDEX idx_food_listings_coords ON food_listings(pickup_latitude, pickup_longitude);

-- 6. DONATION_REQUESTS TABLE
CREATE TABLE donation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES food_listings(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    requested_quantity NUMERIC NOT NULL CHECK (requested_quantity > 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending',
        'approved',
        'rejected',
        'collected',
        'completed',
        'cancelled'
    )),
    pickup_notes TEXT,
    rejection_reason TEXT,
    collection_confirmed_by_recipient BOOLEAN NOT NULL DEFAULT FALSE,
    handover_confirmed_by_donor BOOLEAN NOT NULL DEFAULT FALSE,
    collected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_donation_requests_listing ON donation_requests(listing_id);
CREATE INDEX idx_donation_requests_recipient ON donation_requests(recipient_id);
CREATE INDEX idx_donation_requests_status ON donation_requests(status);

-- 7. AI_ADVISORIES TABLE
-- Stores Gemini AI generated spoilage, urgency, safety, and handling insights
CREATE TABLE ai_advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES food_listings(id) ON DELETE CASCADE UNIQUE,
    spoilage_risk TEXT NOT NULL CHECK (spoilage_risk IN ('LOW', 'MODERATE', 'HIGH', 'UNKNOWN')),
    urgency_level TEXT NOT NULL CHECK (urgency_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    recommended_timeframe_hours NUMERIC NOT NULL CHECK (recommended_timeframe_hours >= 0),
    storage_recommendations TEXT NOT NULL,
    handling_recommendations TEXT NOT NULL,
    safety_warnings TEXT[] NOT NULL DEFAULT '{}',
    confidence_level TEXT NOT NULL CHECK (confidence_level IN ('LOW', 'MEDIUM', 'HIGH')),
    explanation TEXT NOT NULL,
    raw_model_response JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_advisories_listing ON ai_advisories(listing_id);
CREATE INDEX idx_ai_advisories_urgency ON ai_advisories(urgency_level);

-- 8. IMPACT_RECORDS TABLE
-- Quantified environmental and social impact metrics
CREATE TABLE impact_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES food_listings(id) ON DELETE SET NULL,
    request_id UUID REFERENCES donation_requests(id) ON DELETE SET NULL UNIQUE,
    donor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    recipient_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    quantity_rescued_kg NUMERIC NOT NULL CHECK (quantity_rescued_kg >= 0),
    meals_provided NUMERIC NOT NULL CHECK (meals_provided >= 0),
    co2_saved_kg NUMERIC NOT NULL CHECK (co2_saved_kg >= 0),
    water_saved_liters NUMERIC NOT NULL CHECK (water_saved_liters >= 0),
    calculation_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_impact_records_donor ON impact_records(donor_id);
CREATE INDEX idx_impact_records_recipient ON impact_records(recipient_id);
CREATE INDEX idx_impact_records_created ON impact_records(created_at);

-- 9. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN (
        'request_received',
        'request_approved',
        'request_rejected',
        'pickup_reminder',
        'donation_completed',
        'listing_expired',
        'verification_update',
        'system'
    )),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- 10. SYSTEM_SETTINGS TABLE
CREATE TABLE system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed baseline system settings (Conversion factors)
INSERT INTO system_settings (key, value, description)
VALUES 
    ('impact_factors', '{"kg_to_meals": 2.38, "kg_to_co2": 2.50, "kg_to_water_liters": 1000.0}', 'Conversion factors for environmental & meal impact calculations'),
    ('safety_policies', '{"require_verification_to_request": true, "max_reservation_window_hours": 12, "hot_food_temp_min_c": 60, "cold_food_temp_max_c": 4}', 'Platform safety parameters'),
    ('supported_categories', '["Cooked Meals", "Bakery Products", "Fruits", "Vegetables", "Dairy Products", "Packaged Food", "Grains and Cereals", "Other"]', 'Allowed food donation categories')
ON CONFLICT (key) DO NOTHING;

-- 11. ATOMIC TRANSACTION FUNCTIONS

-- Function A: Safely reserve food quantity preventing race conditions
CREATE OR REPLACE FUNCTION reserve_food_quantity(
    p_request_id UUID,
    p_donor_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_req RECORD;
    v_listing RECORD;
    v_new_remaining NUMERIC;
    v_new_status TEXT;
BEGIN
    -- Fetch request
    SELECT * INTO v_req
    FROM donation_requests
    WHERE id = p_request_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Request not found');
    END IF;

    IF v_req.status <> 'pending' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Request is not in pending status');
    END IF;

    -- Fetch and lock the listing
    SELECT * INTO v_listing
    FROM food_listings
    WHERE id = v_req.listing_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Listing not found');
    END IF;

    IF v_listing.donor_id <> p_donor_id THEN
        RETURN jsonb_build_object('success', false, 'error', 'Unauthorized: donor does not own this listing');
    END IF;

    -- Check available quantity
    IF v_listing.remaining_quantity < v_req.requested_quantity THEN
        RETURN jsonb_build_object('success', false, 'error', 'Insufficient remaining quantity. Available: ' || v_listing.remaining_quantity);
    END IF;

    -- Calculate new remaining quantity and listing status
    v_new_remaining := v_listing.remaining_quantity - v_req.requested_quantity;
    IF v_new_remaining = 0 THEN
        v_new_status := 'reserved';
    ELSE
        v_new_status := 'partially_reserved';
    END IF;

    -- Update listing
    UPDATE food_listings
    SET remaining_quantity = v_new_remaining,
        status = v_new_status,
        updated_at = NOW()
    WHERE id = v_listing.id;

    -- Update request
    UPDATE donation_requests
    SET status = 'approved',
        updated_at = NOW()
    WHERE id = v_req.id;

    -- Create notification for recipient
    INSERT INTO notifications (user_id, title, message, type, link_url)
    VALUES (
        v_req.recipient_id,
        'Donation Request Approved! 🎉',
        'Your request for ' || v_req.requested_quantity || ' ' || v_listing.quantity_unit || ' of "' || v_listing.food_name || '" has been approved. Please review pickup details.',
        'request_approved',
        '/recipient/requests'
    );

    RETURN jsonb_build_object(
        'success', true,
        'remaining_quantity', v_new_remaining,
        'listing_status', v_new_status,
        'request_status', 'approved'
    );
END;
$$;

-- Function B: Complete donation upon dual confirmation and register impact
CREATE OR REPLACE FUNCTION complete_donation(
    p_request_id UUID,
    p_user_id UUID,
    p_is_donor BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_req RECORD;
    v_listing RECORD;
    v_impact_factors JSONB;
    v_kg_factor NUMERIC;
    v_co2_factor NUMERIC;
    v_water_factor NUMERIC;
    v_qty_kg NUMERIC;
    v_meals NUMERIC;
    v_co2 NUMERIC;
    v_water NUMERIC;
BEGIN
    SELECT * INTO v_req
    FROM donation_requests
    WHERE id = p_request_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Request not found');
    END IF;

    SELECT * INTO v_listing
    FROM food_listings
    WHERE id = v_req.listing_id;

    -- Update appropriate confirmation flag
    IF p_is_donor THEN
        IF v_listing.donor_id <> p_user_id THEN
            RETURN jsonb_build_object('success', false, 'error', 'Unauthorized: User is not the donor');
        END IF;
        UPDATE donation_requests
        SET handover_confirmed_by_donor = TRUE,
            updated_at = NOW()
        WHERE id = p_request_id;
    ELSE
        IF v_req.recipient_id <> p_user_id THEN
            RETURN jsonb_build_object('success', false, 'error', 'Unauthorized: User is not the recipient');
        END IF;
        UPDATE donation_requests
        SET collection_confirmed_by_recipient = TRUE,
            collected_at = NOW(),
            updated_at = NOW()
        WHERE id = p_request_id;
    END IF;

    -- Re-read request flags
    SELECT * INTO v_req FROM donation_requests WHERE id = p_request_id;

    -- If both confirmed, complete the donation and record impact
    IF v_req.handover_confirmed_by_donor AND v_req.collection_confirmed_by_recipient THEN
        UPDATE donation_requests
        SET status = 'completed',
            updated_at = NOW()
        WHERE id = p_request_id;

        -- If listing has 0 remaining quantity, mark listing completed
        IF v_listing.remaining_quantity = 0 THEN
            UPDATE food_listings
            SET status = 'completed',
                updated_at = NOW()
            WHERE id = v_listing.id;
        END IF;

        -- Get impact factors
        SELECT value INTO v_impact_factors FROM system_settings WHERE key = 'impact_factors';
        v_kg_factor := COALESCE((v_impact_factors->>'kg_to_meals')::NUMERIC, 2.38);
        v_co2_factor := COALESCE((v_impact_factors->>'kg_to_co2')::NUMERIC, 2.50);
        v_water_factor := COALESCE((v_impact_factors->>'kg_to_water_liters')::NUMERIC, 1000.0);

        -- Normalize quantity to kg approximation if in portions or items
        IF v_listing.quantity_unit = 'kg' THEN
            v_qty_kg := v_req.requested_quantity;
        ELSIF v_listing.quantity_unit = 'portions' THEN
            v_qty_kg := v_req.requested_quantity * 0.42; -- 420g standard meal portion
        ELSIF v_listing.quantity_unit = 'boxes' THEN
            v_qty_kg := v_req.requested_quantity * 5.0;  -- 5kg per standard box
        ELSIF v_listing.quantity_unit = 'liters' THEN
            v_qty_kg := v_req.requested_quantity * 1.0;
        ELSE
            v_qty_kg := v_req.requested_quantity * 0.5;
        END IF;

        v_meals := ROUND(v_qty_kg * v_kg_factor, 1);
        v_co2 := ROUND(v_qty_kg * v_co2_factor, 2);
        v_water := ROUND(v_qty_kg * v_water_factor, 0);

        -- Insert into impact_records
        INSERT INTO impact_records (
            listing_id,
            request_id,
            donor_id,
            recipient_id,
            quantity_rescued_kg,
            meals_provided,
            co2_saved_kg,
            water_saved_liters,
            calculation_metadata
        ) VALUES (
            v_listing.id,
            v_req.id,
            v_listing.donor_id,
            v_req.recipient_id,
            v_qty_kg,
            v_meals,
            v_co2,
            v_water,
            jsonb_build_object(
                'unit', v_listing.quantity_unit,
                'raw_quantity', v_req.requested_quantity,
                'factors_applied', v_impact_factors
            )
        );

        -- Notify donor
        INSERT INTO notifications (user_id, title, message, type, link_url)
        VALUES (
            v_listing.donor_id,
            'Donation Complete & Impact Recorded! 🌟',
            'Pickup confirmed for "' || v_listing.food_name || '". You saved ' || v_qty_kg || ' kg of food and prevented ' || v_co2 || ' kg CO2e emissions!',
            'donation_completed',
            '/donor/impact'
        );

        -- Notify recipient
        INSERT INTO notifications (user_id, title, message, type, link_url)
        VALUES (
            v_req.recipient_id,
            'Donation Received! 🍽️',
            'Successfully collected ' || v_req.requested_quantity || ' ' || v_listing.quantity_unit || ' of "' || v_listing.food_name || '". Thank you for rescuing surplus food!',
            'donation_completed',
            '/recipient/impact'
        );

        RETURN jsonb_build_object(
            'success', true,
            'status', 'completed',
            'rescued_kg', v_qty_kg,
            'meals_provided', v_meals,
            'co2_saved_kg', v_co2
        );
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'status', 'partially_confirmed',
        'donor_confirmed', v_req.handover_confirmed_by_donor,
        'recipient_confirmed', v_req.collection_confirmed_by_recipient
    );
END;
$$;

-- 12. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone authenticated can read profiles; users can update own profile
CREATE POLICY "Public profiles are viewable by authenticated users"
ON profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Organizations: Viewable by authenticated users; owners manage own
CREATE POLICY "Organizations viewable by authenticated users"
ON organizations FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Organization owners can insert/update"
ON organizations FOR ALL
TO authenticated
USING (auth.uid() = owner_id);

-- Food listings: Viewable by all authenticated users (or public for discovery)
CREATE POLICY "Available food listings viewable by all"
ON food_listings FOR SELECT
USING (true);

CREATE POLICY "Donors can manage own listings"
ON food_listings FOR ALL
TO authenticated
USING (auth.uid() = donor_id);

-- Donation requests: Viewable by donor and requesting recipient
CREATE POLICY "Donors and recipients can view their requests"
ON donation_requests FOR SELECT
TO authenticated
USING (
    auth.uid() = recipient_id OR 
    EXISTS (SELECT 1 FROM food_listings WHERE id = donation_requests.listing_id AND donor_id = auth.uid())
);

CREATE POLICY "Recipients can create requests"
ON donation_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = recipient_id);

CREATE POLICY "Participants can update requests"
ON donation_requests FOR UPDATE
TO authenticated
USING (
    auth.uid() = recipient_id OR 
    EXISTS (SELECT 1 FROM food_listings WHERE id = donation_requests.listing_id AND donor_id = auth.uid())
);

-- AI Advisories: Viewable by anyone who can view listing
CREATE POLICY "AI advisories viewable by all"
ON ai_advisories FOR SELECT
USING (true);

-- Impact records: Viewable by all authenticated users
CREATE POLICY "Impact records viewable by all"
ON impact_records FOR SELECT
TO authenticated
USING (true);

-- Notifications: Users only see their own notifications
CREATE POLICY "Users see own notifications"
ON notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- System settings: Viewable by all, writable only by admins
CREATE POLICY "System settings viewable by authenticated"
ON system_settings FOR SELECT
TO authenticated
USING (true);

