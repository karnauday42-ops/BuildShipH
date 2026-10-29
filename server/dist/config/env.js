"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasGeminiConfig = exports.hasSupabaseConfig = exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.ENV = {
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
    SUPABASE_URL: process.env.SUPABASE_URL || '',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    JWT_SECRET: process.env.JWT_SECRET || 'foodrescue-secret-jwt-key-2026',
};
exports.hasSupabaseConfig = Boolean(exports.ENV.SUPABASE_URL && (exports.ENV.SUPABASE_ANON_KEY || exports.ENV.SUPABASE_SERVICE_ROLE_KEY));
exports.hasGeminiConfig = Boolean(exports.ENV.GEMINI_API_KEY);
//# sourceMappingURL=env.js.map