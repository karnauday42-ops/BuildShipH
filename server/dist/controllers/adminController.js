"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const store_js_1 = require("../db/store.js");
const impactCalculator_js_1 = require("../services/impactCalculator.js");
class AdminController {
    static async getDashboardStats(req, res) {
        const globalImpact = impactCalculator_js_1.ImpactCalculator.getGlobalImpact();
        const profiles = Array.from(store_js_1.db.profiles.values());
        const listings = Array.from(store_js_1.db.listings.values());
        const requests = Array.from(store_js_1.db.requests.values());
        const orgs = Array.from(store_js_1.db.organizations.values());
        const pendingOrgs = orgs.filter(o => o.verification_status === 'pending').length;
        const criticalListings = listings.filter(l => l.status === 'available' && l.advisory?.urgency_level === 'CRITICAL').length;
        res.json({
            impact: globalImpact,
            stats: {
                total_users: profiles.length,
                donors_count: profiles.filter(p => p.role === 'donor').length,
                recipients_count: profiles.filter(p => p.role === 'recipient').length,
                total_organizations: orgs.length,
                pending_verifications: pendingOrgs,
                total_listings: listings.length,
                active_listings: listings.filter(l => l.status === 'available' || l.status === 'partially_reserved').length,
                critical_urgent_listings: criticalListings,
                total_requests: requests.length,
                completed_requests: requests.filter(r => r.status === 'completed').length,
            },
        });
    }
    static async getUsers(req, res) {
        const users = Array.from(store_js_1.db.profiles.values()).map(p => {
            const org = Array.from(store_js_1.db.organizations.values()).find(o => o.owner_id === p.id);
            return {
                ...p,
                organization: org || null,
            };
        });
        res.json({ users });
    }
    static async toggleUserStatus(req, res) {
        const id = String(req.params.id);
        const profile = store_js_1.db.profiles.get(id);
        if (!profile) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        profile.is_active = !profile.is_active;
        profile.updated_at = new Date().toISOString();
        res.json({
            message: `User account is now ${profile.is_active ? 'active' : 'suspended'}`,
            profile,
        });
    }
    static async getReports(req, res) {
        const listings = Array.from(store_js_1.db.listings.values());
        const requests = Array.from(store_js_1.db.requests.values());
        // Category breakdown
        const categoryCounts = {};
        listings.forEach(l => {
            categoryCounts[l.category] = (categoryCounts[l.category] || 0) + 1;
        });
        // Urgency distribution
        const urgencyCounts = {
            CRITICAL: 0,
            HIGH: 0,
            MEDIUM: 0,
            LOW: 0,
        };
        listings.forEach(l => {
            const u = l.advisory?.urgency_level || 'MEDIUM';
            urgencyCounts[u] = (urgencyCounts[u] || 0) + 1;
        });
        // Rescue rate
        const totalRequests = requests.length;
        const completedRequests = requests.filter(r => r.status === 'completed').length;
        const rescueRatePct = totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0;
        res.json({
            category_breakdown: categoryCounts,
            urgency_distribution: urgencyCounts,
            rescue_rate_percent: rescueRatePct,
            impact: impactCalculator_js_1.ImpactCalculator.getGlobalImpact(),
        });
    }
    static async getSettings(req, res) {
        const settings = {};
        store_js_1.db.systemSettings.forEach((val, key) => {
            settings[key] = val;
        });
        res.json({ settings });
    }
    static async updateSettings(req, res) {
        const { key, value } = req.body;
        if (!key || value === undefined) {
            res.status(400).json({ error: 'Key and value are required' });
            return;
        }
        store_js_1.db.systemSettings.set(key, value);
        res.json({ message: 'Setting updated successfully', key, value });
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=adminController.js.map