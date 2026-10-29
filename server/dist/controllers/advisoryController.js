"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvisoryController = void 0;
const index_js_1 = require("../schemas/index.js");
const geminiService_js_1 = require("../services/geminiService.js");
const store_js_1 = require("../db/store.js");
class AdvisoryController {
    static async previewAdvisory(req, res) {
        const parseResult = index_js_1.AIAdvisoryInputSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
            return;
        }
        const input = parseResult.data;
        try {
            const advisory = await geminiService_js_1.GeminiService.generateAdvisory(input);
            res.json({ advisory });
        }
        catch (err) {
            res.status(500).json({ error: 'Failed to generate AI advisory', message: err.message });
        }
    }
    static async getListingAdvisory(req, res) {
        const { listingId } = req.params;
        const advisory = Array.from(store_js_1.db.advisories.values()).find(a => a.listing_id === listingId);
        if (!advisory) {
            res.status(404).json({ error: 'Advisory not found for this listing' });
            return;
        }
        res.json({ advisory });
    }
}
exports.AdvisoryController = AdvisoryController;
//# sourceMappingURL=advisoryController.js.map