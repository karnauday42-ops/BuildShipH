import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { ENV } from '../config/env.js';
import { db } from '../db/store.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { LoginSchema, RegisterSchema } from '../schemas/index.js';
import { Organization, Profile } from '../types/index.js';

export class AuthController {
  static async register(req: AuthenticatedRequest, res: Response): Promise<void> {
    const parseResult = RegisterSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
      return;
    }

    const data = parseResult.data;

    // Check if email already registered
    const existing = Array.from(db.profiles.values()).find(p => p.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const userId = uuidv4();
    const newProfile: Profile = {
      id: userId,
      email: data.email.toLowerCase(),
      full_name: data.full_name,
      role: data.role,
      phone: data.phone || null,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.full_name)}`,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.profiles.set(newProfile.id, newProfile);

    // If organization details provided, create organization
    let org: Organization | null = null;
    if (data.organization_name) {
      org = {
        id: uuidv4(),
        owner_id: newProfile.id,
        organization_name: data.organization_name,
        organization_type: data.organization_type || 'other',
        address: data.address || 'Unspecified location',
        latitude: data.latitude || 37.7749,
        longitude: data.longitude || -122.4194,
        verification_status: data.role === 'recipient' ? 'pending' : 'verified',
        capacity_kg: 200,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      db.organizations.set(org.id, org);
    }

    // Generate JWT
    const token = jwt.sign(
      { sub: newProfile.id, email: newProfile.email, role: newProfile.role },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      profile: newProfile,
      organization: org,
    });
  }

  static async login(req: AuthenticatedRequest, res: Response): Promise<void> {
    const parseResult = LoginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: 'Invalid credentials payload' });
      return;
    }

    const { email, password } = parseResult.data;
    const profile = Array.from(db.profiles.values()).find(
      p => p.email.toLowerCase() === email.toLowerCase()
    );

    if (!profile) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    if (!profile.is_active) {
      res.status(403).json({ error: 'Account has been suspended' });
      return;
    }

    // Demo password or valid length check
    if (password.length < 4) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      { sub: profile.id, email: profile.email, role: profile.role },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const org = Array.from(db.organizations.values()).find(o => o.owner_id === profile.id) || null;

    res.json({
      token,
      profile,
      organization: org,
    });
  }

  static async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const org = Array.from(db.organizations.values()).find(o => o.owner_id === req.user!.id) || null;

    res.json({
      profile: req.user,
      organization: org,
    });
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const profile = db.profiles.get(req.user.id);
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    const { full_name, phone, avatar_url } = req.body;
    if (full_name) profile.full_name = full_name;
    if (phone !== undefined) profile.phone = phone;
    if (avatar_url !== undefined) profile.avatar_url = avatar_url;
    profile.updated_at = new Date().toISOString();

    res.json({ profile });
  }

  static async switchDemoRole(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { role } = req.body;
    if (!['donor', 'recipient', 'admin'].includes(role)) {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }

    const profile = Array.from(db.profiles.values()).find(p => p.role === role);
    if (!profile) {
      res.status(404).json({ error: 'Demo user not found for role' });
      return;
    }

    const token = jwt.sign(
      { sub: profile.id, email: profile.email, role: profile.role },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const org = Array.from(db.organizations.values()).find(o => o.owner_id === profile.id) || null;

    res.json({
      token,
      profile,
      organization: org,
    });
  }
}

