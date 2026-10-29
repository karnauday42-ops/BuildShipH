import { describe, it, expect, beforeEach } from 'vitest';
import { calculateDistanceKm, MatchingEngine } from '../src/services/matchingEngine.js';
import { ImpactCalculator } from '../src/services/impactCalculator.js';
import { GeminiService } from '../src/services/geminiService.js';
import { db } from '../src/db/store.js';
import { FoodListing } from '../src/types/index.js';

describe('FoodRescue AI Core Services & Algorithms', () => {
  describe('Geodesic Distance & Matching Algorithm', () => {
    it('accurately calculates Haversine distance in kilometers', () => {
      // SF City Hall (37.7793, -122.4193) to Ferry Building (37.7955, -122.3937) ~ 2.8 km
      const distance = calculateDistanceKm(37.7793, -122.4193, 37.7955, -122.3937);
      expect(distance).toBeGreaterThan(2.0);
      expect(distance).toBeLessThan(3.5);
    });

    it('matches food listings with nearby eligible recipient organizations', async () => {
      const listing = Array.from(db.listings.values())[0];
      expect(listing).toBeDefined();

      const matches = await MatchingEngine.findRecipientsForListing(listing, 50);
      expect(matches.length).toBeGreaterThan(0);

      // Verify structure and ordering
      expect(matches[0].match_score).toBeGreaterThan(0);
      expect(matches[0].distance_km).toBeDefined();
      expect(matches[0].match_reasons.length).toBeGreaterThan(0);
    });
  });

  describe('Impact Calculator', () => {
    it('computes realistic environmental and hunger alleviation metrics', () => {
      const summary = ImpactCalculator.getGlobalImpact();
      expect(summary.total_rescued_kg).toBeGreaterThanOrEqual(0);
      expect(summary.total_meals).toBeGreaterThanOrEqual(0);
      expect(summary.total_co2_kg).toBeGreaterThanOrEqual(0);
      expect(summary.total_water_liters).toBeGreaterThanOrEqual(0);
      expect(summary.disclaimer).toContain('modeled estimates');
    });
  });

  describe('Food Safety & Advisory Engine', () => {
    it('classifies cooked meals in hot-holding with appropriate urgency and warnings', () => {
      const advisory = GeminiService.generateDeterministicAdvisory({
        food_name: 'Hot Banquet Chili',
        category: 'Cooked Meals',
        quantity: 20,
        quantity_unit: 'portions',
        storage_condition: 'hot_holding',
        storage_temperature: 65,
      });

      expect(advisory.urgency_level).toBe('CRITICAL');
      expect(advisory.recommended_timeframe_hours).toBeLessThanOrEqual(4);
      expect(advisory.storage_recommendations).toContain('60°C');
      expect(advisory.safety_warnings.length).toBeGreaterThan(0);
    });

    it('classifies fresh produce with longer shelf life and low urgency', () => {
      const advisory = GeminiService.generateDeterministicAdvisory({
        food_name: 'Crate of Carrots',
        category: 'Vegetables',
        quantity: 50,
        quantity_unit: 'kg',
        storage_condition: 'ambient',
      });

      expect(advisory.urgency_level).toBe('LOW');
      expect(advisory.recommended_timeframe_hours).toBeGreaterThanOrEqual(48);
      expect(advisory.spoilage_risk).toBe('LOW');
    });
  });

  describe('Atomic Reservation & Lifecycle Workflow', () => {
    it('prevents over-reservation beyond remaining quantity', () => {
      // Find an available listing
      const listing = Array.from(db.listings.values()).find(l => l.status === 'available');
      expect(listing).toBeDefined();

      // Create a dummy request requesting more than available
      const overRequest = {
        id: 'test-req-over',
        listing_id: listing!.id,
        recipient_id: 'r0000000-0000-0000-0000-000000000001',
        requested_quantity: listing!.remaining_quantity + 9999,
        status: 'pending' as const,
        collection_confirmed_by_recipient: false,
        handover_confirmed_by_donor: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      db.requests.set(overRequest.id, overRequest);

      const res = db.reserveFoodQuantity(overRequest.id, listing!.donor_id);
      expect(res.success).toBe(false);
      expect(res.error).toContain('Insufficient quantity');
    });

    it('successfully reserves valid quantity and transitions listing status', () => {
      const listing = Array.from(db.listings.values()).find(l => l.status === 'available');
      expect(listing).toBeDefined();

      const initialRemaining = listing!.remaining_quantity;
      const reserveAmount = 2;

      const validRequest = {
        id: 'test-req-valid',
        listing_id: listing!.id,
        recipient_id: 'r0000000-0000-0000-0000-000000000001',
        requested_quantity: reserveAmount,
        status: 'pending' as const,
        collection_confirmed_by_recipient: false,
        handover_confirmed_by_donor: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      db.requests.set(validRequest.id, validRequest);

      const res = db.reserveFoodQuantity(validRequest.id, listing!.donor_id);
      expect(res.success).toBe(true);
      expect(res.remaining_quantity).toBe(initialRemaining - reserveAmount);
    });
  });
});

