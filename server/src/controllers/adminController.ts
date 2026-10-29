import { Response } from 'express';
import { db } from '../db/store.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { ImpactCalculator } from '../services/impactCalculator.js';

export class AdminController {
  static async getDashboardStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    const globalImpact = ImpactCalculator.getGlobalImpact();
    const profiles = Array.from(db.profiles.values());
    const listings = Array.from(db.listings.values());
    const requests = Array.from(db.requests.values());
    const orgs = Array.from(db.organizations.values());

    const pendingOrgs = orgs.filter(o => o.verification_status === 'pending').length;
    const criticalListings = listings.filter(
      l => l.status === 'available' && l.advisory?.urgency_level === 'CRITICAL'
    ).length;

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

  static async getUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    const users = Array.from(db.profiles.values()).map(p => {
      const org = Array.from(db.organizations.values()).find(o => o.owner_id === p.id);
      return {
        ...p,
        organization: org || null,
      };
    });

    res.json({ users });
  }

  static async toggleUserStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    const id = String(req.params.id);
    const profile = db.profiles.get(id);

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

  static async getReports(req: AuthenticatedRequest, res: Response): Promise<void> {
    const listings = Array.from(db.listings.values());
    const requests = Array.from(db.requests.values());

    // Category breakdown
    const categoryCounts: Record<string, number> = {};
    listings.forEach(l => {
      categoryCounts[l.category] = (categoryCounts[l.category] || 0) + 1;
    });

    // Urgency distribution
    const urgencyCounts: Record<string, number> = {
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
      impact: ImpactCalculator.getGlobalImpact(),
    });
  }

  static async getSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    const settings: Record<string, any> = {};
    db.systemSettings.forEach((val, key) => {
      settings[key] = val;
    });
    res.json({ settings });
  }

  static async updateSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { key, value } = req.body;
    if (!key || value === undefined) {
      res.status(400).json({ error: 'Key and value are required' });
      return;
    }

    db.systemSettings.set(key, value);
    res.json({ message: 'Setting updated successfully', key, value });
  }
}
