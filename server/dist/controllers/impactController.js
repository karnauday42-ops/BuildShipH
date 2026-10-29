"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImpactController = void 0;
const store_js_1 = require("../db/store.js");
const impactCalculator_js_1 = require("../services/impactCalculator.js");
class ImpactController {
    static async getGlobalImpact(req, res) {
        const summary = impactCalculator_js_1.ImpactCalculator.getGlobalImpact();
        res.json(summary);
    }
    static async getDonorImpact(req, res) {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const donorId = req.params.id ? String(req.params.id) : req.user.id;
        const summary = impactCalculator_js_1.ImpactCalculator.getDonorImpact(donorId);
        const records = Array.from(store_js_1.db.impactRecords.values()).filter(r => r.donor_id === donorId);
        res.json({ ...summary, recent_records: records });
    }
    static async getRecipientImpact(req, res) {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const recipientId = req.params.id ? String(req.params.id) : req.user.id;
        const summary = impactCalculator_js_1.ImpactCalculator.getRecipientImpact(recipientId);
        const records = Array.from(store_js_1.db.impactRecords.values()).filter(r => r.recipient_id === recipientId);
        res.json({ ...summary, recent_records: records });
    }
}
exports.ImpactController = ImpactController;
//# sourceMappingURL=impactController.js.map