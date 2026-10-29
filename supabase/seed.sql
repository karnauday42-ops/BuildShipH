-- ====================================================================
-- FoodRescue AI — Smart Surplus Food Management Platform
-- Realistic Seed Data
-- ====================================================================

-- 1. PROFILES (Deterministic UUIDs for cross-referencing)
-- Note: In Supabase Auth, these UUIDs match auth.users entries
INSERT INTO profiles (id, full_name, email, role, phone, avatar_url, is_active)
VALUES 
    -- Admin
    ('a0000000-0000-0000-0000-000000000001', 'Elena Rostova (Admin)', 'admin@foodrescue.ai', 'admin', '+1-555-0100', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', true),
    
    -- Donors
    ('d0000000-0000-0000-0000-000000000001', 'Marco Rossi (GreenBistro)', 'donor.bistro@foodrescue.ai', 'donor', '+1-555-0111', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', true),
    ('d0000000-0000-0000-0000-000000000002', 'Sarah Jenkins (FreshHarvest Market)', 'donor.market@foodrescue.ai', 'donor', '+1-555-0112', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', true),
    ('d0000000-0000-0000-0000-000000000003', 'Chef David Chen (Grand Plaza Hotel)', 'donor.hotel@foodrescue.ai', 'donor', '+1-555-0113', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', true),
    
    -- Recipients
    ('r0000000-0000-0000-0000-000000000001', 'Sister Teresa (Hope Food Bank)', 'recipient.hope@foodrescue.ai', 'recipient', '+1-555-0121', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', true),
    ('r0000000-0000-0000-0000-000000000002', 'Marcus Vance (Community Care Kitchen)', 'recipient.kitchen@foodrescue.ai', 'recipient', '+1-555-0122', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', true),
    ('r0000000-0000-0000-0000-000000000003', 'Amina Diallo (Shelter Haven NGO)', 'recipient.shelter@foodrescue.ai', 'recipient', '+1-555-0123', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150', true)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;

-- 2. ORGANIZATIONS
INSERT INTO organizations (id, owner_id, organization_name, organization_type, registration_number, description, address, city, state, postal_code, latitude, longitude, verification_status, capacity_kg)
VALUES
    -- Donor Orgs
    ('o0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'GreenBistro Organic Cafe', 'restaurant_group', 'REST-88310', 'Farm-to-table organic cafe minimizing daily kitchen surplus.', '452 Elm Street', 'San Francisco', 'CA', '94102', 37.7749, -122.4194, 'verified', 150),
    ('o0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 'FreshHarvest Supermarket', 'grocery_chain', 'GROC-44219', 'Community supermarket donating near-expiry fresh produce & dairy.', '890 Market Street', 'San Francisco', 'CA', '94103', 37.7833, -122.4067, 'verified', 800),
    ('o0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003', 'Grand Plaza Hotel Catering', 'restaurant_group', 'HOTEL-1092', 'Executive banquet kitchen offering pristine surplus event portions.', '120 Mission Street', 'San Francisco', 'CA', '94105', 37.7915, -122.3980, 'verified', 500),

    -- Recipient Orgs
    ('o0000000-0000-0000-0000-000000000004', 'r0000000-0000-0000-0000-000000000001', 'Hope Metro Food Bank', 'food_bank', 'NGO-501C3-991', 'Regional hunger relief serving over 1,200 families weekly with temperature-controlled transit.', '1250 Folsom St', 'San Francisco', 'CA', '94103', 37.7758, -122.4098, 'verified', 2500),
    ('o0000000-0000-0000-0000-000000000005', 'r0000000-0000-0000-0000-000000000002', 'Community Care Kitchen', 'community_kitchen', 'NGO-501C3-448', 'Hot meal program distributing 400 nutritious dinners every evening to unhoused community members.', '730 Howard St', 'San Francisco', 'CA', '94103', 37.7850, -122.4010, 'verified', 600),
    ('o0000000-0000-0000-0000-000000000006', 'r0000000-0000-0000-0000-000000000003', 'Shelter Haven Youth Center', 'shelter', 'NGO-501C3-112', 'Safe transitional emergency shelter for at-risk youth and young families.', '310 Valencia St', 'San Francisco', 'CA', '94103', 37.7680, -122.4220, 'pending', 350)
ON CONFLICT (id) DO NOTHING;

-- 3. FOOD_LISTINGS
INSERT INTO food_listings (
    id, donor_id, organization_id, food_name, category, description,
    quantity, remaining_quantity, quantity_unit, preparation_time, best_before_time,
    storage_condition, storage_temperature, pickup_address, pickup_latitude, pickup_longitude,
    pickup_start_time, pickup_end_time, vegetarian, allergens, packaging_status, image_url, status
)
VALUES
    -- Listing 1: Cooked Meals (Urgent)
    (
        'f0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000003',
        'o0000000-0000-0000-0000-000000000003',
        'Roasted Vegetable Medley & Herb Chicken Portions',
        'Cooked Meals',
        'Surplus from a conference banquet lunch, kept continuously in professional insulated hot-holding units at 65°C.',
        45,
        45,
        'portions',
        NOW() - INTERVAL '3 hours',
        NOW() + INTERVAL '5 hours',
        'hot_holding',
        65,
        '120 Mission Street, Banquet Kitchen Loading Bay, San Francisco, CA',
        37.7915,
        -122.3980,
        NOW(),
        NOW() + INTERVAL '4 hours',
        false,
        ARRAY['poultry'],
        'sealed_aluminum_pans',
        'https://images.unsplash.com/photo-1547592180-85f173990554?w=600',
        'available'
    ),
    -- Listing 2: Bakery Products (Medium Urgency)
    (
        'f0000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000001',
        'o0000000-0000-0000-0000-000000000001',
        'Artisan Sourdough Loaves & Croissants',
        'Bakery Products',
        'Fresh morning bake surplus: 20 rustic sourdough loaves and 30 butter croissants packaged in clean bakery crates.',
        25,
        25,
        'kg',
        NOW() - INTERVAL '10 hours',
        NOW() + INTERVAL '24 hours',
        'dry_storage',
        20,
        '452 Elm Street, GreenBistro Back Door, San Francisco, CA',
        37.7749,
        -122.4194,
        NOW(),
        NOW() + INTERVAL '8 hours',
        true,
        ARRAY['gluten', 'dairy'],
        'food_grade_paper_bags',
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600',
        'available'
    ),
    -- Listing 3: Fresh Produce / Fruits & Veg (Low Urgency)
    (
        'f0000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000002',
        'o0000000-0000-0000-0000-000000000002',
        'Organic Gala Apples & Valencia Oranges',
        'Fruits',
        'Slightly blemish-marked but pristine, crisp organic apples and sweet oranges from recent shipment rotation.',
        80,
        80,
        'kg',
        NOW() - INTERVAL '1 day',
        NOW() + INTERVAL '4 days',
        'ambient',
        18,
        '890 Market Street, Receiving Dock A, San Francisco, CA',
        37.7833,
        -122.4067,
        NOW() + INTERVAL '1 hour',
        NOW() + INTERVAL '18 hours',
        true,
        '{}',
        'vented_produce_crates',
        'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600',
        'available'
    ),
    -- Listing 4: Dairy Products (High Urgency)
    (
        'f0000000-0000-0000-0000-000000000004',
        'd0000000-0000-0000-0000-000000000002',
        'o0000000-0000-0000-0000-000000000002',
        'Greek Yogurt Tubs & Whole Organic Milk',
        'Dairy Products',
        'Sealed cold dairy near sell-by date (48 hrs remaining). Maintained uninterrupted cold chain at 3°C.',
        50,
        50,
        'items',
        NOW() - INTERVAL '2 days',
        NOW() + INTERVAL '36 hours',
        'refrigerated',
        3,
        '890 Market Street, Receiving Dock A, San Francisco, CA',
        37.7833,
        -122.4067,
        NOW(),
        NOW() + INTERVAL '6 hours',
        true,
        ARRAY['dairy', 'lactose'],
        'original_factory_sealed',
        'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600',
        'available'
    )
ON CONFLICT (id) DO NOTHING;

-- 4. AI_ADVISORIES
INSERT INTO ai_advisories (
    id, listing_id, spoilage_risk, urgency_level, recommended_timeframe_hours,
    storage_recommendations, handling_recommendations, safety_warnings,
    confidence_level, explanation
)
VALUES
    -- Advisory 1
    (
        'b0000000-0000-0000-0000-000000000001',
        'f0000000-0000-0000-0000-000000000001',
        'MODERATE',
        'CRITICAL',
        3.5,
        'Maintain strictly in commercial thermal carriers above 60°C (140°F) or rapidly chill to below 4°C within 2 hours of pickup.',
        'Recipient must verify core temperature using a calibrated food probe thermometer upon receipt. Consume or refrigerate immediately.',
        ARRAY[
            'Cooked poultry and mixed dishes enter the temperature danger zone rapidly if uninsulated.',
            'Do not re-heat more than once; discard if left between 4°C and 60°C for longer than 2 hours.',
            'Advisory is AI-generated guidance. Visual & olfactory inspection by certified food handlers is mandatory.'
        ],
        'HIGH',
        'Prepared banquet dishes possess high moisture and protein content, making them susceptible to rapid bacterial multiplication if temperature fluctuates.'
    ),
    -- Advisory 2
    (
        'b0000000-0000-0000-0000-000000000002',
        'f0000000-0000-0000-0000-000000000002',
        'LOW',
        'MEDIUM',
        20.0,
        'Store in cool, dry location with good ventilation away from humidity sources. Keep sealed until redistribution.',
        'Handle with clean food tongs or disposable gloves. Check for moisture condensation inside plastic packaging.',
        ARRAY[
            'Contains wheat gluten and butter dairy; label clearly for allergic recipients.',
            'Verify packaging remains dry and undamaged.'
        ],
        'HIGH',
        'Low water activity in crusty sourdough gives extended stability, but croissants have higher butter content requiring distribution within 24 hours.'
    ),
    -- Advisory 3
    (
        'b0000000-0000-0000-0000-000000000003',
        'f0000000-0000-0000-0000-000000000003',
        'LOW',
        'LOW',
        72.0,
        'Store in cool ambient room or refrigerated produce cellar (8°C - 12°C). Ensure airflow between crates.',
        'Inspect individual fruits during sorting; remove any bruised pieces to avoid ethylene acceleration on neighboring fruit.',
        ARRAY[
            'Rinse thoroughly under running water prior to direct consumption.',
            'Produce must be inspected manually before distribution.'
        ],
        'HIGH',
        'Intact tree fruits have a robust outer peel providing natural shelf stability. High suitability for community pantry distribution.'
    ),
    -- Advisory 4
    (
        'b0000000-0000-0000-0000-000000000004',
        'f0000000-0000-0000-0000-000000000004',
        'MODERATE',
        'HIGH',
        12.0,
        'Requires continuous active refrigeration below 4°C (39°F). Use insulated ice boxes during transit.',
        'Check container seals for bulging or vacuum failure. Reject any packages with broken security seals.',
        ARRAY[
            'Cold chain integrity is critical for pasteurized dairy products.',
            'Contains milk allergens; prioritize recipients equipped with commercial refrigerators.'
        ],
        'HIGH',
        'Dairy approaching sell-by date retains nutritional value and safety if cold chain remains uninterrupted under 4°C.'
    )
ON CONFLICT (id) DO NOTHING;

-- 5. NOTIFICATIONS
INSERT INTO notifications (id, user_id, title, message, type, link_url)
VALUES
    (
        'e0000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000003',
        'Urgent Listing Published 🚀',
        'Your listing "Roasted Vegetable Medley & Herb Chicken Portions" has been matched with 2 nearby verified kitchens.',
        'system',
        '/donor/listings/f0000000-0000-0000-0000-000000000001'
    ),
    (
        'e0000000-0000-0000-0000-000000000002',
        'r0000000-0000-0000-0000-000000000002',
        'High Priority Surplus Alert 🍲',
        'Grand Plaza Hotel has published 45 portions of hot-holding meals 0.8 miles from Community Care Kitchen.',
        'system',
        '/recipient/available-food/f0000000-0000-0000-0000-000000000001'
    )
ON CONFLICT (id) DO NOTHING;

