"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const env_js_1 = require("../config/env.js");
const store_js_1 = require("../db/store.js");
const index_js_1 = require("../schemas/index.js");
class AuthController {
    static async register(req, res) {
        const parseResult = index_js_1.RegisterSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
            return;
        }
        const data = parseResult.data;
        // Check if email already registered
        const existing = Array.from(store_js_1.db.profiles.values()).find(p => p.email.toLowerCase() === data.email.toLowerCase());
        if (existing) {
            res.status(409).json({ error: 'Email already registered' });
            return;
        }
        const userId = (0, uuid_1.v4)();
        const newProfile = {
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
        store_js_1.db.profiles.set(newProfile.id, newProfile);
        // If organization details provided, create organization
        let org = null;
        if (data.organization_name) {
            org = {
                id: (0, uuid_1.v4)(),
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
            store_js_1.db.organizations.set(org.id, org);
        }
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ sub: newProfile.id, email: newProfile.email, role: newProfile.role }, env_js_1.ENV.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            message: 'Registration successful',
            token,
            profile: newProfile,
            organization: org,
        });
    }
    static async login(req, res) {
        const parseResult = index_js_1.LoginSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: 'Invalid credentials payload' });
            return;
        }
        const { email, password } = parseResult.data;
        const profile = Array.from(store_js_1.db.profiles.values()).find(p => p.email.toLowerCase() === email.toLowerCase());
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
        const token = jsonwebtoken_1.default.sign({ sub: profile.id, email: profile.email, role: profile.role }, env_js_1.ENV.JWT_SECRET, { expiresIn: '7d' });
        const org = Array.from(store_js_1.db.organizations.values()).find(o => o.owner_id === profile.id) || null;
        res.json({
            token,
            profile,
            organization: org,
        });
    }
    static async getMe(req, res) {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const org = Array.from(store_js_1.db.organizations.values()).find(o => o.owner_id === req.user.id) || null;
        res.json({
            profile: req.user,
            organization: org,
        });
    }
    static async updateProfile(req, res) {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const profile = store_js_1.db.profiles.get(req.user.id);
        if (!profile) {
            res.status(404).json({ error: 'Profile not found' });
            return;
        }
        const { full_name, phone, avatar_url } = req.body;
        if (full_name)
            profile.full_name = full_name;
        if (phone !== undefined)
            profile.phone = phone;
        if (avatar_url !== undefined)
            profile.avatar_url = avatar_url;
        profile.updated_at = new Date().toISOString();
        res.json({ profile });
    }
    static async switchDemoRole(req, res) {
        const { role } = req.body;
        if (!['donor', 'recipient', 'admin'].includes(role)) {
            res.status(400).json({ error: 'Invalid role' });
            return;
        }
        const profile = Array.from(store_js_1.db.profiles.values()).find(p => p.role === role);
        if (!profile) {
            res.status(404).json({ error: 'Demo user not found for role' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ sub: profile.id, email: profile.email, role: profile.role }, env_js_1.ENV.JWT_SECRET, { expiresIn: '7d' });
        const org = Array.from(store_js_1.db.organizations.values()).find(o => o.owner_id === profile.id) || null;
        res.json({
            token,
            profile,
            organization: org,
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map