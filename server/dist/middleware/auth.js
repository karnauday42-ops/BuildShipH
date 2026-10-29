"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_js_1 = require("../config/env.js");
const store_js_1 = require("../db/store.js");
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing or malformed Authorization header' });
        return;
    }
    const token = authHeader.split(' ')[1];
    // 1. Check for standard demo session tokens
    if (token.startsWith('demo-token-')) {
        const role = token.replace('demo-token-', '');
        // Find matching profile
        const profile = Array.from(store_js_1.db.profiles.values()).find(p => p.role === role);
        if (profile) {
            if (!profile.is_active) {
                res.status(403).json({ error: 'Account has been suspended' });
                return;
            }
            req.user = profile;
            next();
            return;
        }
    }
    // 2. JWT Verification
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_js_1.ENV.JWT_SECRET);
        const profile = store_js_1.db.profiles.get(decoded.sub);
        if (!profile) {
            res.status(401).json({ error: 'User profile not found' });
            return;
        }
        if (!profile.is_active) {
            res.status(403).json({ error: 'Account has been suspended' });
            return;
        }
        req.user = profile;
        next();
    }
    catch (err) {
        res.status(401).json({ error: 'Invalid or expired authentication token' });
    }
}
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                error: `Forbidden: Access requires one of [${roles.join(', ')}] role`,
            });
            return;
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map