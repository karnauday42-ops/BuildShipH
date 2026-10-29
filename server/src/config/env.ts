import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || 'foodrescue-secret-jwt-key-2026',
};

export const hasSupabaseConfig = Boolean(
  ENV.SUPABASE_URL && (ENV.SUPABASE_ANON_KEY || ENV.SUPABASE_SERVICE_ROLE_KEY)
);

export const hasGeminiConfig = Boolean(ENV.GEMINI_API_KEY);

