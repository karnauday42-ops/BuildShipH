"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingController = void 0;
const uuid_1 = require("uuid");
const store_js_1 = require("../db/store.js");
const index_js_1 = require("../schemas/index.js");
const geminiService_js_1 = require("../services/geminiService.js");
const matchingEngine_js_1 = require("../services/matchingEngine.js");
class ListingController {
    static async getListings(req, res) {
        const { search, category, vegetarian, urgency, status, donor_id, max_distance, lat, lng, } = req.query;
        let items = Array.from(store_js_1.db.listings.values());
        // Filter by donor
        if (donor_id) {
            items = items.filter(l => l.donor_id === String(donor_id));
        }
        // Filter by status (default to available / partially_reserved for general browsing)
        if (status) {
            items = items.filter(l => l.status === status);
        }
        else if (!donor_id) {
            items = items.filter(l => l.status === 'available' || l.status === 'partially_reserved');
        }
        // Filter by category
        if (category && category !== 'All') {
            items = items.filter(l => l.category === category);
        }
        // Filter by vegetarian
        if (vegetarian === 'true') {
            items = items.filter(l => l.vegetarian);
        }
        // Search by name or description
        if (search && typeof search === 'string') {
            const q = search.toLowerCase();
            items = items.filter(l => l.food_name.toLowerCase().includes(q) ||
                (l.description && l.description.toLowerCase().includes(q)));
        }
        // Filter by urgency
        if (urgency && typeof urgency === 'string') {
            items = items.filter(l => l.advisory?.urgency_level === urgency);
        }
        // Ensure advisories are populated
        items = items.map(l => {
            if (!l.advisory) {
                const adv = Array.from(store_js_1.db.advisories.values()).find(a => a.listing_id === l.id);
                if (adv)
                    l.advisory = adv;
            }
            return l;
        });
        // Sort by urgency priority (CRITICAL -> HIGH -> MEDIUM -> LOW) then newest
        const urgencyWeight = {
            CRITICAL: 4,
            HIGH: 3,
            MEDIUM: 2,
            LOW: 1,
        };
        items.sort((a, b) => {
            const aWeight = a.advisory ? urgencyWeight[a.advisory.urgency_level] || 0 : 0;
            const bWeight = b.advisory ? urgencyWeight[b.advisory.urgency_level] || 0 : 0;
            if (bWeight !== aWeight)
                return bWeight - aWeight;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        res.json({ listings: items });
    }
    static async getListingById(req, res) {
        const id = String(req.params.id);
        const listing = store_js_1.db.listings.get(id);
        if (!listing) {
            res.status(404).json({ error: 'Listing not found' });
            return;
        }
        const advisory = Array.from(store_js_1.db.advisories.values()).find(a => a.listing_id === id) || null;
        const org = listing.organization_id ? store_js_1.db.organizations.get(listing.organization_id) : null;
        const donor = store_js_1.db.profiles.get(listing.donor_id);
        res.json({
            listing: {
                ...listing,
                advisory,
                donor_name: org ? org.organization_name : donor?.full_name || 'Anonymous Donor',
                organization: org,
            },
        });
    }
    static async createListing(req, res) {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const parseResult = index_js_1.CreateListingSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
            return;
        }
        const data = parseResult.data;
        const listingId = (0, uuid_1.v4)();
        // Find donor's organization if exists
        const donorOrg = Array.from(store_js_1.db.organizations.values()).find(o => o.owner_id === req.user.id);
        // 1. Generate AI Spoilage & Urgency Advisory via Gemini Service
        const advisory = await geminiService_js_1.GeminiService.generateAdvisory({
            food_name: data.food_name,
            category: data.category,
            description: data.description,
            quantity: data.quantity,
            quantity_unit: data.quantity_unit,
            preparation_time: data.preparation_time,
            best_before_time: data.best_before_time,
            storage_condition: data.storage_condition,
            storage_temperature: data.storage_temperature,
            packaging_status: data.packaging_status,
            allergens: data.allergens,
            pickup_end_time: data.pickup_end_time,
        }, listingId);
        // Save advisory
        store_js_1.db.advisories.set(advisory.id, advisory);
        // 2. Create listing
        const listing = {
            id: listingId,
            donor_id: req.user.id,
            organization_id: donorOrg?.id || null,
            food_name: data.food_name,
            category: data.category,
            description: data.description || '',
            quantity: data.quantity,
            remaining_quantity: data.quantity,
            quantity_unit: data.quantity_unit,
            preparation_time: data.preparation_time,
            best_before_time: data.best_before_time,
            storage_condition: data.storage_condition,
            storage_temperature: data.storage_temperature,
            pickup_address: data.pickup_address,
            pickup_latitude: data.pickup_latitude,
            pickup_longitude: data.pickup_longitude,
            pickup_start_time: data.pickup_start_time,
            pickup_end_time: data.pickup_end_time,
            vegetarian: data.vegetarian,
            allergens: data.allergens,
            packaging_status: data.packaging_status,
            image_url: data.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
            status: data.status,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            donor_name: donorOrg?.organization_name || req.user.full_name,
            advisory,
        };
        store_js_1.db.listings.set(listing.id, listing);
        // 3. Proactive Intelligent Matching: Match with nearby recipients and trigger notifications
        try {
            const matches = await matchingEngine_js_1.MatchingEngine.findRecipientsForListing(listing, 15);
            const topRecipients = matches.slice(0, 3);
            for (const m of topRecipients) {
                store_js_1.db.createNotification({
                    user_id: m.recipient_id,
                    title: `New Food Surplus Alert: ${listing.food_name}`,
                    message: `${listing.donor_name} listed ${listing.quantity} ${listing.quantity_unit} of ${listing.category} (${m.distance_km} km away). Match score: ${m.match_score}%.`,
                    type: 'system',
                    link_url: `/recipient/available-food/${listing.id}`,
                });
            }
        }
        catch (err) {
            console.warn('Matching notification error:', err);
        }
        res.status(201).json({
            message: 'Listing created successfully with AI advisory',
            listing,
            advisory,
        });
    }
    static async updateListing(req, res) {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const id = String(req.params.id);
        const listing = store_js_1.db.listings.get(id);
        if (!listing) {
            res.status(404).json({ error: 'Listing not found' });
            return;
        }
        if (listing.donor_id !== req.user.id && req.user.role !== 'admin') {
            res.status(403).json({ error: 'Forbidden: You do not own this listing' });
            return;
        }
        const parseResult = index_js_1.UpdateListingSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
            return;
        }
        Object.assign(listing, parseResult.data, { updated_at: new Date().toISOString() });
        store_js_1.db.listings.set(id, listing);
        res.json({ listing });
    }
    static async cancelListing(req, res) {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const id = String(req.params.id);
        const listing = store_js_1.db.listings.get(id);
        if (!listing) {
            res.status(404).json({ error: 'Listing not found' });
            return;
        }
        if (listing.donor_id !== req.user.id && req.user.role !== 'admin') {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        listing.status = 'cancelled';
        listing.updated_at = new Date().toISOString();
        res.json({ message: 'Listing cancelled', listing });
    }
}
exports.ListingController = ListingController;
//# sourceMappingURL=listingController.js.map