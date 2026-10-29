"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_js_1 = require("./config/env.js");
// Route imports
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const listingRoutes_js_1 = __importDefault(require("./routes/listingRoutes.js"));
const requestRoutes_js_1 = __importDefault(require("./routes/requestRoutes.js"));
const advisoryRoutes_js_1 = __importDefault(require("./routes/advisoryRoutes.js"));
const matchingRoutes_js_1 = __importDefault(require("./routes/matchingRoutes.js"));
const impactRoutes_js_1 = __importDefault(require("./routes/impactRoutes.js"));
const organizationRoutes_js_1 = __importDefault(require("./routes/organizationRoutes.js"));
const adminRoutes_js_1 = __importDefault(require("./routes/adminRoutes.js"));
const notificationRoutes_js_1 = __importDefault(require("./routes/notificationRoutes.js"));
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)({
    origin: true, // Allow frontend dev & preview origins
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'FoodRescue AI Backend API',
        timestamp: new Date().toISOString(),
        environment: env_js_1.ENV.NODE_ENV,
        features: {
            gemini_ai: Boolean(env_js_1.ENV.GEMINI_API_KEY),
            supabase: Boolean(env_js_1.ENV.SUPABASE_URL),
        },
    });
});
// Mount Routes
app.use('/api/auth', authRoutes_js_1.default);
app.use('/api/listings', listingRoutes_js_1.default);
app.use('/api/requests', requestRoutes_js_1.default);
app.use('/api/advisories', advisoryRoutes_js_1.default);
app.use('/api/matching', matchingRoutes_js_1.default);
app.use('/api/impact', impactRoutes_js_1.default);
app.use('/api/organizations', organizationRoutes_js_1.default);
app.use('/api/admin', adminRoutes_js_1.default);
app.use('/api/notifications', notificationRoutes_js_1.default);
// Global Error Handler
app.use((err, req, res, next) => {
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
    app.listen(env_js_1.ENV.PORT, () => {
        console.log(`====================================================`);
        console.log(`🚀 FoodRescue AI Server listening on port ${env_js_1.ENV.PORT}`);
        console.log(`🌱 Client URL configured: ${env_js_1.ENV.CLIENT_URL}`);
        console.log(`🤖 Gemini AI configured: ${Boolean(env_js_1.ENV.GEMINI_API_KEY)}`);
        console.log(`📦 Supabase configured: ${Boolean(env_js_1.ENV.SUPABASE_URL)}`);
        console.log(`====================================================`);
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map