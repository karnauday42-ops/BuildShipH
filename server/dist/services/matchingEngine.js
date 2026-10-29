"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchingEngine = void 0;
exports.calculateDistanceKm = calculateDistanceKm;
const store_js_1 = require("../db/store.js");
const geminiService_js_1 = require("./geminiService.js");
/**
 * Calculates Haversine distance in kilometers between two lat/lng coordinates
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
}
class MatchingEngine {
    /**
     * Matches a food listing with verified nearby recipient organizations
     */
    static async findRecipientsForListing(listing, maxDistanceKm = 25) {
        const results = [];
        const urgency = listing.advisory?.urgency_level || 'MEDIUM';
        // Retrieve all recipient organizations
        const orgs = Array.from(store_js_1.db.organizations.values()).filter(org => org.owner_id !== listing.donor_id);
        for (const org of orgs) {
            // Must have coordinates
            if (!org.latitude || !org.longitude)
                continue;
            const dist = calculateDistanceKm(listing.pickup_latitude, listing.pickup_longitude, org.latitude, org.longitude);
            if (dist > maxDistanceKm)
                continue;
            let score = 50; // base score
            const reasons = [];
            // 1. Distance scoring (up to 30 points)
            if (dist <= 3) {
                score += 30;
                reasons.push(`Proximity: within 3 km (${dist} km away)`);
            }
            else if (dist <= 8) {
                score += 20;
                reasons.push(`Nearby location (${dist} km away)`);
            }
            else if (dist <= 15) {
                score += 10;
                reasons.push(`Accessible radius (${dist} km away)`);
            }
            else {
                score += 5;
            }
            // 2. Verification Status (up to 20 points)
            if (org.verification_status === 'verified') {
                score += 20;
                reasons.push('Verified non-profit charity credentials');
            }
            else if (org.verification_status === 'pending') {
                score += 5;
                reasons.push('Verification currently pending administrative review');
            }
            // 3. Organization Type vs Food Category synergy (up to 20 points)
            if (listing.category === 'Cooked Meals') {
                if (org.organization_type === 'community_kitchen' || org.organization_type === 'shelter') {
                    score += 20;
                    reasons.push('Equipped for immediate hot meal distribution to clients');
                }
                else if (org.organization_type === 'food_bank') {
                    score += 10;
                }
            }
            else if (listing.category === 'Fruits' || listing.category === 'Vegetables' || listing.category === 'Packaged Food') {
                if (org.organization_type === 'food_bank') {
                    score += 20;
                    reasons.push('Large-scale warehouse pantry distribution infrastructure');
                }
                else {
                    score += 12;
                }
            }
            else {
                score += 10;
            }
            // 4. Urgency Factor
            if (urgency === 'CRITICAL' && dist <= 5) {
                score += 15;
                reasons.push('Critical urgency priority: within rapid pickup window');
            }
            else if (urgency === 'HIGH' && dist <= 10) {
                score += 10;
                reasons.push('High urgency match: rapid transfer enabled');
            }
            // 5. Capacity Check
            if (org.capacity_kg >= listing.quantity) {
                score += 10;
                reasons.push(`Sufficient intake capacity (${org.capacity_kg} kg max)`);
            }
            const match_score = Math.min(100, Math.max(10, score));
            results.push({
                recipient_id: org.owner_id,
                organization_id: org.id,
                organization_name: org.organization_name,
                organization_type: org.organization_type,
                distance_km: dist,
                capacity_kg: org.capacity_kg,
                match_score,
                match_reasons: reasons,
            });
        }
        // Sort descending by score
        results.sort((a, b) => b.match_score - a.match_score);
        // Generate AI recommendation for the top matches
        for (let i = 0; i < Math.min(3, results.length); i++) {
            const top = results[i];
            try {
                top.ai_recommendation_summary = await geminiService_js_1.GeminiService.generateMatchingInsights(listing.food_name, listing.category, listing.quantity, listing.quantity_unit, urgency, top.organization_name, top.organization_type, top.distance_km);
            }
            catch {
                top.ai_recommendation_summary = `Optimal rescue match located ${top.distance_km} km away.`;
            }
        }
        return results;
    }
}
exports.MatchingEngine = MatchingEngine;
//# sourceMappingURL=matchingEngine.js.map