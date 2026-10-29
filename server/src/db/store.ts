import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { ENV, hasSupabaseConfig } from '../config/env.js';
import {
  Profile,
  Organization,
  FoodListing,
  DonationRequest,
  AIAdvisory,
  ImpactRecord,
  Notification,
} from '../types/index.js';

export let supabase: SupabaseClient | null = null;

if (hasSupabaseConfig) {
  try {
    supabase = createClient(
      ENV.SUPABASE_URL,
      ENV.SUPABASE_SERVICE_ROLE_KEY || ENV.SUPABASE_ANON_KEY
    );
    console.log('✅ Supabase client initialized.');
  } catch (err) {
    console.warn('⚠️ Could not connect to Supabase. Operating with in-memory persistence fallback.', err);
  }
}

// In-Memory Data Store (pre-seeded with realistic production-grade data)
class MemoryStore {
  profiles: Map<string, Profile> = new Map();
  organizations: Map<string, Organization> = new Map();
  listings: Map<string, FoodListing> = new Map();
  requests: Map<string, DonationRequest> = new Map();
  advisories: Map<string, AIAdvisory> = new Map();
  impactRecords: Map<string, ImpactRecord> = new Map();
  notifications: Map<string, Notification> = new Map();
  systemSettings: Map<string, any> = new Map();

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // 1. Settings
    this.systemSettings.set('impact_factors', {
      kg_to_meals: 2.38,
      kg_to_co2: 2.50,
      kg_to_water_liters: 1000.0,
    });
    this.systemSettings.set('safety_policies', {
      require_verification_to_request: true,
      max_reservation_window_hours: 12,
      hot_food_temp_min_c: 60,
      cold_food_temp_max_c: 4,
    });

    // 2. Profiles
    const admin: Profile = {
      id: 'a0000000-0000-0000-0000-000000000001',
      full_name: 'Elena Rostova (Platform Admin)',
      email: 'admin@foodrescue.ai',
      role: 'admin',
      phone: '+1-555-0100',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      is_active: true,
      created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
      updated_at: new Date().toISOString(),
    };

    const donor1: Profile = {
      id: 'd0000000-0000-0000-0000-000000000001',
      full_name: 'Marco Rossi',
      email: 'donor.bistro@foodrescue.ai',
      role: 'donor',
      phone: '+1-555-0111',
      avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      is_active: true,
      created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
      updated_at: new Date().toISOString(),
    };

    const donor2: Profile = {
      id: 'd0000000-0000-0000-0000-000000000002',
      full_name: 'Sarah Jenkins',
      email: 'donor.market@foodrescue.ai',
      role: 'donor',
      phone: '+1-555-0112',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      is_active: true,
      created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
      updated_at: new Date().toISOString(),
    };

    const donor3: Profile = {
      id: 'd0000000-0000-0000-0000-000000000003',
      full_name: 'Chef David Chen',
      email: 'donor.hotel@foodrescue.ai',
      role: 'donor',
      phone: '+1-555-0113',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      is_active: true,
      created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
      updated_at: new Date().toISOString(),
    };

    const recipient1: Profile = {
      id: 'r0000000-0000-0000-0000-000000000001',
      full_name: 'Sister Teresa',
      email: 'recipient.hope@foodrescue.ai',
      role: 'recipient',
      phone: '+1-555-0121',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      is_active: true,
      created_at: new Date(Date.now() - 86400000 * 25).toISOString(),
      updated_at: new Date().toISOString(),
    };

    const recipient2: Profile = {
      id: 'r0000000-0000-0000-0000-000000000002',
      full_name: 'Marcus Vance',
      email: 'recipient.kitchen@foodrescue.ai',
      role: 'recipient',
      phone: '+1-555-0122',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      is_active: true,
      created_at: new Date(Date.now() - 86400000 * 18).toISOString(),
      updated_at: new Date().toISOString(),
    };

    const recipient3: Profile = {
      id: 'r0000000-0000-0000-0000-000000000003',
      full_name: 'Amina Diallo',
      email: 'recipient.shelter@foodrescue.ai',
      role: 'recipient',
      phone: '+1-555-0123',
      avatar_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150',
      is_active: true,
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: new Date().toISOString(),
    };

    [admin, donor1, donor2, donor3, recipient1, recipient2, recipient3].forEach(p => {
      this.profiles.set(p.id, p);
    });

    // 3. Organizations
    const orgs: Organization[] = [
      {
        id: 'o0000000-0000-0000-0000-000000000001',
        owner_id: donor1.id,
        organization_name: 'GreenBistro Organic Cafe',
        organization_type: 'restaurant_group',
        registration_number: 'REST-88310',
        description: 'Farm-to-table organic cafe minimizing daily kitchen surplus.',
        address: '452 Elm Street',
        city: 'San Francisco',
        state: 'CA',
        postal_code: '94102',
        latitude: 37.7749,
        longitude: -122.4194,
        verification_status: 'verified',
        capacity_kg: 150,
        created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'o0000000-0000-0000-0000-000000000002',
        owner_id: donor2.id,
        organization_name: 'FreshHarvest Supermarket',
        organization_type: 'grocery_chain',
        registration_number: 'GROC-44219',
        description: 'Community supermarket donating near-expiry fresh produce & dairy.',
        address: '890 Market Street',
        city: 'San Francisco',
        state: 'CA',
        postal_code: '94103',
        latitude: 37.7833,
        longitude: -122.4067,
        verification_status: 'verified',
        capacity_kg: 800,
        created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'o0000000-0000-0000-0000-000000000003',
        owner_id: donor3.id,
        organization_name: 'Grand Plaza Hotel Catering',
        organization_type: 'restaurant_group',
        registration_number: 'HOTEL-1092',
        description: 'Executive banquet kitchen offering pristine surplus event portions.',
        address: '120 Mission Street',
        city: 'San Francisco',
        state: 'CA',
        postal_code: '94105',
        latitude: 37.7915,
        longitude: -122.3980,
        verification_status: 'verified',
        capacity_kg: 500,
        created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'o0000000-0000-0000-0000-000000000004',
        owner_id: recipient1.id,
        organization_name: 'Hope Metro Food Bank',
        organization_type: 'food_bank',
        registration_number: 'NGO-501C3-991',
        description: 'Regional hunger relief serving over 1,200 families weekly with temperature-controlled transit.',
        address: '1250 Folsom St',
        city: 'San Francisco',
        state: 'CA',
        postal_code: '94103',
        latitude: 37.7758,
        longitude: -122.4098,
        verification_status: 'verified',
        capacity_kg: 2500,
        created_at: new Date(Date.now() - 86400000 * 25).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'o0000000-0000-0000-0000-000000000005',
        owner_id: recipient2.id,
        organization_name: 'Community Care Kitchen',
        organization_type: 'community_kitchen',
        registration_number: 'NGO-501C3-448',
        description: 'Hot meal program distributing 400 nutritious dinners every evening to unhoused community members.',
        address: '730 Howard St',
        city: 'San Francisco',
        state: 'CA',
        postal_code: '94103',
        latitude: 37.7850,
        longitude: -122.4010,
        verification_status: 'verified',
        capacity_kg: 600,
        created_at: new Date(Date.now() - 86400000 * 18).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'o0000000-0000-0000-0000-000000000006',
        owner_id: recipient3.id,
        organization_name: 'Shelter Haven Youth Center',
        organization_type: 'shelter',
        registration_number: 'NGO-501C3-112',
        description: 'Safe transitional emergency shelter for at-risk youth and young families.',
        address: '310 Valencia St',
        city: 'San Francisco',
        state: 'CA',
        postal_code: '94103',
        latitude: 37.7680,
        longitude: -122.4220,
        verification_status: 'pending',
        capacity_kg: 350,
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    orgs.forEach(o => this.organizations.set(o.id, o));

    // 4. Food Listings
    const now = Date.now();
    const l1: FoodListing = {
      id: 'f0000000-0000-0000-0000-000000000001',
      donor_id: donor3.id,
      organization_id: 'o0000000-0000-0000-0000-000000000003',
      food_name: 'Roasted Vegetable Medley & Herb Chicken Portions',
      category: 'Cooked Meals',
      description: 'Surplus from a conference banquet lunch, kept continuously in professional insulated hot-holding units at 65°C.',
      quantity: 45,
      remaining_quantity: 45,
      quantity_unit: 'portions',
      preparation_time: new Date(now - 3600000 * 3).toISOString(),
      best_before_time: new Date(now + 3600000 * 5).toISOString(),
      storage_condition: 'hot_holding',
      storage_temperature: 65,
      pickup_address: '120 Mission Street, Banquet Kitchen Loading Bay, San Francisco, CA',
      pickup_latitude: 37.7915,
      pickup_longitude: -122.3980,
      pickup_start_time: new Date(now).toISOString(),
      pickup_end_time: new Date(now + 3600000 * 4).toISOString(),
      vegetarian: false,
      allergens: ['poultry'],
      packaging_status: 'sealed_aluminum_pans',
      image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600',
      status: 'available',
      created_at: new Date(now - 3600000 * 2).toISOString(),
      updated_at: new Date().toISOString(),
      donor_name: 'Grand Plaza Hotel Catering',
    };

    const l2: FoodListing = {
      id: 'f0000000-0000-0000-0000-000000000002',
      donor_id: donor1.id,
      organization_id: 'o0000000-0000-0000-0000-000000000001',
      food_name: 'Artisan Sourdough Loaves & Croissants',
      category: 'Bakery Products',
      description: 'Fresh morning bake surplus: 20 rustic sourdough loaves and 30 butter croissants packaged in clean bakery crates.',
      quantity: 25,
      remaining_quantity: 25,
      quantity_unit: 'kg',
      preparation_time: new Date(now - 3600000 * 8).toISOString(),
      best_before_time: new Date(now + 3600000 * 24).toISOString(),
      storage_condition: 'dry_storage',
      storage_temperature: 20,
      pickup_address: '452 Elm Street, GreenBistro Back Door, San Francisco, CA',
      pickup_latitude: 37.7749,
      pickup_longitude: -122.4194,
      pickup_start_time: new Date(now).toISOString(),
      pickup_end_time: new Date(now + 3600000 * 8).toISOString(),
      vegetarian: true,
      allergens: ['gluten', 'dairy'],
      packaging_status: 'food_grade_paper_bags',
      image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600',
      status: 'available',
      created_at: new Date(now - 3600000 * 5).toISOString(),
      updated_at: new Date().toISOString(),
      donor_name: 'GreenBistro Organic Cafe',
    };

    const l3: FoodListing = {
      id: 'f0000000-0000-0000-0000-000000000003',
      donor_id: donor2.id,
      organization_id: 'o0000000-0000-0000-0000-000000000002',
      food_name: 'Organic Gala Apples & Valencia Oranges',
      category: 'Fruits',
      description: 'Slightly blemish-marked but pristine, crisp organic apples and sweet oranges from recent shipment rotation.',
      quantity: 80,
      remaining_quantity: 80,
      quantity_unit: 'kg',
      preparation_time: new Date(now - 86400000).toISOString(),
      best_before_time: new Date(now + 86400000 * 4).toISOString(),
      storage_condition: 'ambient',
      storage_temperature: 18,
      pickup_address: '890 Market Street, Receiving Dock A, San Francisco, CA',
      pickup_latitude: 37.7833,
      pickup_longitude: -122.4067,
      pickup_start_time: new Date(now + 3600000).toISOString(),
      pickup_end_time: new Date(now + 3600000 * 18).toISOString(),
      vegetarian: true,
      allergens: [],
      packaging_status: 'vented_produce_crates',
      image_url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600',
      status: 'available',
      created_at: new Date(now - 3600000 * 10).toISOString(),
      updated_at: new Date().toISOString(),
      donor_name: 'FreshHarvest Supermarket',
    };

    const l4: FoodListing = {
      id: 'f0000000-0000-0000-0000-000000000004',
      donor_id: donor2.id,
      organization_id: 'o0000000-0000-0000-0000-000000000002',
      food_name: 'Greek Yogurt Tubs & Whole Organic Milk',
      category: 'Dairy Products',
      description: 'Sealed cold dairy near sell-by date (48 hrs remaining). Maintained uninterrupted cold chain at 3°C.',
      quantity: 50,
      remaining_quantity: 50,
      quantity_unit: 'items',
      preparation_time: new Date(now - 86400000 * 2).toISOString(),
      best_before_time: new Date(now + 3600000 * 36).toISOString(),
      storage_condition: 'refrigerated',
      storage_temperature: 3,
      pickup_address: '890 Market Street, Receiving Dock A, San Francisco, CA',
      pickup_latitude: 37.7833,
      pickup_longitude: -122.4067,
      pickup_start_time: new Date(now).toISOString(),
      pickup_end_time: new Date(now + 3600000 * 6).toISOString(),
      vegetarian: true,
      allergens: ['dairy', 'lactose'],
      packaging_status: 'original_factory_sealed',
      image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600',
      status: 'available',
      created_at: new Date(now - 3600000 * 1).toISOString(),
      updated_at: new Date().toISOString(),
      donor_name: 'FreshHarvest Supermarket',
    };

    [l1, l2, l3, l4].forEach(l => this.listings.set(l.id, l));

    // 5. Advisories
    const adv1: AIAdvisory = {
      id: 'b0000000-0000-0000-0000-000000000001',
      listing_id: l1.id,
      spoilage_risk: 'MODERATE',
      urgency_level: 'CRITICAL',
      recommended_timeframe_hours: 3.5,
      storage_recommendations: 'Maintain strictly in commercial thermal carriers above 60°C (140°F) or rapidly chill to below 4°C within 2 hours of pickup.',
      handling_recommendations: 'Recipient must verify core temperature using a calibrated food probe thermometer upon receipt. Consume or refrigerate immediately.',
      safety_warnings: [
        'Cooked poultry and mixed dishes enter the temperature danger zone rapidly if uninsulated.',
        'Do not re-heat more than once; discard if left between 4°C and 60°C for longer than 2 hours.',
        'Advisory is AI-generated guidance. Visual & olfactory inspection by certified food handlers is mandatory.'
      ],
      confidence_level: 'HIGH',
      explanation: 'Prepared banquet dishes possess high moisture and protein content, making them susceptible to rapid bacterial multiplication if temperature fluctuates.',
      created_at: new Date().toISOString(),
    };

    const adv2: AIAdvisory = {
      id: 'b0000000-0000-0000-0000-000000000002',
      listing_id: l2.id,
      spoilage_risk: 'LOW',
      urgency_level: 'MEDIUM',
      recommended_timeframe_hours: 20.0,
      storage_recommendations: 'Store in cool, dry location with good ventilation away from humidity sources. Keep sealed until redistribution.',
      handling_recommendations: 'Handle with clean food tongs or disposable gloves. Check for moisture condensation inside packaging.',
      safety_warnings: [
        'Contains wheat gluten and butter dairy; label clearly for allergic recipients.',
        'Verify packaging remains dry and undamaged.'
      ],
      confidence_level: 'HIGH',
      explanation: 'Low water activity in crusty sourdough gives extended stability, but croissants have higher butter content requiring distribution within 24 hours.',
      created_at: new Date().toISOString(),
    };

    const adv3: AIAdvisory = {
      id: 'b0000000-0000-0000-0000-000000000003',
      listing_id: l3.id,
      spoilage_risk: 'LOW',
      urgency_level: 'LOW',
      recommended_timeframe_hours: 72.0,
      storage_recommendations: 'Store in cool ambient room or refrigerated produce cellar (8°C - 12°C). Ensure airflow between crates.',
      handling_recommendations: 'Inspect individual fruits during sorting; remove any bruised pieces to avoid ethylene acceleration on neighboring fruit.',
      safety_warnings: [
        'Rinse thoroughly under running water prior to direct consumption.',
        'Produce must be inspected manually before distribution.'
      ],
      confidence_level: 'HIGH',
      explanation: 'Intact tree fruits have a robust outer peel providing natural shelf stability. High suitability for community pantry distribution.',
      created_at: new Date().toISOString(),
    };

    const adv4: AIAdvisory = {
      id: 'b0000000-0000-0000-0000-000000000004',
      listing_id: l4.id,
      spoilage_risk: 'MODERATE',
      urgency_level: 'HIGH',
      recommended_timeframe_hours: 12.0,
      storage_recommendations: 'Requires continuous active refrigeration below 4°C (39°F). Use insulated ice boxes during transit.',
      handling_recommendations: 'Check container seals for bulging or vacuum failure. Reject any packages with broken security seals.',
      safety_warnings: [
        'Cold chain integrity is critical for pasteurized dairy products.',
        'Contains milk allergens; prioritize recipients equipped with commercial refrigerators.'
      ],
      confidence_level: 'HIGH',
      explanation: 'Dairy approaching sell-by date retains nutritional value and safety if cold chain remains uninterrupted under 4°C.',
      created_at: new Date().toISOString(),
    };

    [adv1, adv2, adv3, adv4].forEach(a => {
      this.advisories.set(a.id, a);
      const listing = this.listings.get(a.listing_id);
      if (listing) {
        listing.advisory = a;
      }
    });

    // 6. Historical completed request & Impact record
    const pastListingId = 'f9999999-0000-0000-0000-000000000001';
    const pastListing: FoodListing = {
      id: pastListingId,
      donor_id: donor1.id,
      organization_id: 'o0000000-0000-0000-0000-000000000001',
      food_name: 'Gourmet Bagels & Herb Focaccia Breads',
      category: 'Bakery Products',
      description: 'Delivered to Hope Food Bank yesterday evening.',
      quantity: 30,
      remaining_quantity: 0,
      quantity_unit: 'kg',
      storage_condition: 'dry_storage',
      pickup_address: '452 Elm Street, San Francisco, CA',
      pickup_latitude: 37.7749,
      pickup_longitude: -122.4194,
      pickup_start_time: new Date(now - 86400000).toISOString(),
      pickup_end_time: new Date(now - 3600000 * 20).toISOString(),
      vegetarian: true,
      allergens: ['gluten'],
      packaging_status: 'cartons',
      status: 'completed',
      created_at: new Date(now - 86400000 * 2).toISOString(),
      updated_at: new Date(now - 3600000 * 18).toISOString(),
      donor_name: 'GreenBistro Organic Cafe',
    };
    this.listings.set(pastListing.id, pastListing);

    const pastRequestId = 'req00000-0000-0000-0000-000000000001';
    const pastRequest: DonationRequest = {
      id: pastRequestId,
      listing_id: pastListing.id,
      recipient_id: recipient1.id,
      organization_id: 'o0000000-0000-0000-0000-000000000004',
      requested_quantity: 30,
      status: 'completed',
      collection_confirmed_by_recipient: true,
      handover_confirmed_by_donor: true,
      collected_at: new Date(now - 3600000 * 18).toISOString(),
      created_at: new Date(now - 86400000).toISOString(),
      updated_at: new Date(now - 3600000 * 18).toISOString(),
      listing: pastListing,
      recipient: recipient1,
      organization: this.organizations.get('o0000000-0000-0000-0000-000000000004'),
    };
    this.requests.set(pastRequest.id, pastRequest);

    const pastImpact: ImpactRecord = {
      id: 'imp00000-0000-0000-0000-000000000001',
      listing_id: pastListing.id,
      request_id: pastRequest.id,
      donor_id: donor1.id,
      recipient_id: recipient1.id,
      quantity_rescued_kg: 30,
      meals_provided: 71.4,
      co2_saved_kg: 75.0,
      water_saved_liters: 30000,
      calculation_metadata: {
        unit: 'kg',
        factors: { kg_to_meals: 2.38, kg_to_co2: 2.5, kg_to_water_liters: 1000 },
      },
      created_at: new Date(now - 3600000 * 18).toISOString(),
    };
    this.impactRecords.set(pastImpact.id, pastImpact);

    // 7. Notifications
    const n1: Notification = {
      id: 'e0000000-0000-0000-0000-000000000001',
      user_id: donor3.id,
      title: 'Urgent Listing Published 🚀',
      message: 'Your listing "Roasted Vegetable Medley & Herb Chicken Portions" has been matched with 2 nearby verified kitchens.',
      type: 'system',
      is_read: false,
      link_url: `/donor/listings/${l1.id}`,
      created_at: new Date(now - 3600000 * 2).toISOString(),
    };

    const n2: Notification = {
      id: 'e0000000-0000-0000-0000-000000000002',
      user_id: recipient2.id,
      title: 'High Priority Surplus Alert 🍲',
      message: 'Grand Plaza Hotel has published 45 portions of hot-holding meals 0.8 miles from Community Care Kitchen.',
      type: 'system',
      is_read: false,
      link_url: `/recipient/available-food/${l1.id}`,
      created_at: new Date(now - 3600000 * 2).toISOString(),
    };

    [n1, n2].forEach(n => this.notifications.set(n.id, n));
  }

  // ATOMIC RESERVATION FUNCTION
  reserveFoodQuantity(requestId: string, donorId: string): { success: boolean; error?: string; remaining_quantity?: number; listing_status?: string } {
    const req = this.requests.get(requestId);
    if (!req) return { success: false, error: 'Request not found' };
    if (req.status !== 'pending') return { success: false, error: 'Request is not in pending status' };

    const listing = this.listings.get(req.listing_id);
    if (!listing) return { success: false, error: 'Listing not found' };
    if (listing.donor_id !== donorId) return { success: false, error: 'Unauthorized: You do not own this listing' };

    if (listing.remaining_quantity < req.requested_quantity) {
      return { success: false, error: `Insufficient quantity available. Current remaining: ${listing.remaining_quantity}` };
    }

    const newRemaining = listing.remaining_quantity - req.requested_quantity;
    const newStatus = newRemaining === 0 ? 'reserved' : 'partially_reserved';

    listing.remaining_quantity = newRemaining;
    listing.status = newStatus;
    listing.updated_at = new Date().toISOString();

    req.status = 'approved';
    req.updated_at = new Date().toISOString();

    // Trigger notification
    this.createNotification({
      user_id: req.recipient_id,
      title: 'Donation Request Approved! 🎉',
      message: `Your request for ${req.requested_quantity} ${listing.quantity_unit} of "${listing.food_name}" has been approved! Please review pickup details.`,
      type: 'request_approved',
      link_url: '/recipient/requests',
    });

    return {
      success: true,
      remaining_quantity: newRemaining,
      listing_status: newStatus,
    };
  }

  // ATOMIC PICKUP & COMPLETION CONFIRMATION
  confirmPickup(requestId: string, userId: string, isDonor: boolean): { success: boolean; error?: string; completed?: boolean; impact?: any } {
    const req = this.requests.get(requestId);
    if (!req) return { success: false, error: 'Request not found' };

    const listing = this.listings.get(req.listing_id);
    if (!listing) return { success: false, error: 'Listing not found' };

    if (isDonor) {
      if (listing.donor_id !== userId) return { success: false, error: 'Unauthorized donor user' };
      req.handover_confirmed_by_donor = true;
    } else {
      if (req.recipient_id !== userId) return { success: false, error: 'Unauthorized recipient user' };
      req.collection_confirmed_by_recipient = true;
      req.collected_at = new Date().toISOString();
    }
    req.updated_at = new Date().toISOString();

    // Dual confirmation check
    if (req.handover_confirmed_by_donor && req.collection_confirmed_by_recipient) {
      req.status = 'completed';
      if (listing.remaining_quantity === 0) {
        listing.status = 'completed';
      }
      listing.updated_at = new Date().toISOString();

      // Normalize quantity to kg
      let qtyKg = req.requested_quantity;
      if (listing.quantity_unit === 'portions') qtyKg = req.requested_quantity * 0.42;
      else if (listing.quantity_unit === 'boxes') qtyKg = req.requested_quantity * 5.0;
      else if (listing.quantity_unit === 'liters') qtyKg = req.requested_quantity * 1.0;
      else if (listing.quantity_unit === 'items') qtyKg = req.requested_quantity * 0.5;

      const factors = this.systemSettings.get('impact_factors') || {
        kg_to_meals: 2.38,
        kg_to_co2: 2.50,
        kg_to_water_liters: 1000.0,
      };

      const meals = Math.round(qtyKg * factors.kg_to_meals * 10) / 10;
      const co2 = Math.round(qtyKg * factors.kg_to_co2 * 100) / 100;
      const water = Math.round(qtyKg * factors.kg_to_water_liters);

      const impactRecord: ImpactRecord = {
        id: uuidv4(),
        listing_id: listing.id,
        request_id: req.id,
        donor_id: listing.donor_id,
        recipient_id: req.recipient_id,
        quantity_rescued_kg: Math.round(qtyKg * 10) / 10,
        meals_provided: meals,
        co2_saved_kg: co2,
        water_saved_liters: water,
        calculation_metadata: {
          original_quantity: req.requested_quantity,
          unit: listing.quantity_unit,
          factors,
        },
        created_at: new Date().toISOString(),
      };

      this.impactRecords.set(impactRecord.id, impactRecord);

      // Notify donor
      this.createNotification({
        user_id: listing.donor_id,
        title: 'Donation Completed & Impact Recorded! 🌟',
        message: `Pickup confirmed for "${listing.food_name}". You rescued ${impactRecord.quantity_rescued_kg} kg and prevented ${impactRecord.co2_saved_kg} kg CO2e!`,
        type: 'donation_completed',
        link_url: '/donor/impact',
      });

      // Notify recipient
      this.createNotification({
        user_id: req.recipient_id,
        title: 'Donation Collection Completed! 🍽️',
        message: `Successfully collected ${req.requested_quantity} ${listing.quantity_unit} of "${listing.food_name}". Thank you for fighting food waste!`,
        type: 'donation_completed',
        link_url: '/recipient/impact',
      });

      return {
        success: true,
        completed: true,
        impact: impactRecord,
      };
    }

    return {
      success: true,
      completed: false,
    };
  }

  createNotification(data: Omit<Notification, 'id' | 'is_read' | 'created_at'>): Notification {
    const notif: Notification = {
      id: uuidv4(),
      user_id: data.user_id,
      title: data.title,
      message: data.message,
      type: data.type,
      is_read: false,
      link_url: data.link_url || null,
      created_at: new Date().toISOString(),
    };
    this.notifications.set(notif.id, notif);
    return notif;
  }
}

export const db = new MemoryStore();

