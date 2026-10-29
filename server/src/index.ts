import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import advisoryRoutes from './routes/advisoryRoutes.js';
import matchingRoutes from './routes/matchingRoutes.js';
import impactRoutes from './routes/impactRoutes.js';
import organizationRoutes from './routes/organizationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const app = express();

// Middlewares
app.use(cors({
  origin: true, // Allow frontend dev & preview origins
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'FoodRescue AI Backend API',
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV,
    features: {
      gemini_ai: Boolean(ENV.GEMINI_API_KEY),
      supabase: Boolean(ENV.SUPABASE_URL),
    },
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/advisories', advisoryRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.status || err.statusCode || 500;
  
  // Specific handler for malformed client JSON
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      error: 'Malformed JSON payload received',
      details: err.message,
    });
    return;
  }

  console.error('Unhandled Server Error:', err);
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    code: err.code,
  });
});

// Process-level safety guards
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(ENV.PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 FoodRescue AI Server listening on port ${ENV.PORT}`);
    console.log(`🌱 Client URL configured: ${ENV.CLIENT_URL}`);
    console.log(`🤖 Gemini AI configured: ${Boolean(ENV.GEMINI_API_KEY)}`);
    console.log(`📦 Supabase configured: ${Boolean(ENV.SUPABASE_URL)}`);
    console.log(`====================================================`);
  });
}

export default app;

