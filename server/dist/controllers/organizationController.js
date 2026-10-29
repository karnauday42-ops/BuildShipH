"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationController = void 0;
const uuid_1 = require("uuid");
const store_js_1 = require("../db/store.js");
const index_js_1 = require("../schemas/index.js");
class OrganizationController {
    static async getMyOrganization(req, res) {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const org = Array.from(store_js_1.db.organizations.values()).find(o => o.owner_id === req.user.id);
        if (!org) {
            res.status(404).json({ error: 'Organization not found' });
            return;
        }
        res.json({ organization: org });
    }
    static async getOrganizations(req, res) {
        const { status, type } = req.query;
        let list = Array.from(store_js_1.db.organizations.values());
        if (status) {
            list = list.filter(o => o.verification_status === status);
        }
        if (type) {
            list = list.filter(o => o.organization_type === type);
        }
        res.json({ organizations: list });
    }
    static async upsertMyOrganization(req, res) {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const parseResult = index_js_1.CreateOrganizationSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
            return;
        }
        const data = parseResult.data;
        let org = Array.from(store_js_1.db.organizations.values()).find(o => o.owner_id === req.user.id);
        if (org) {
            Object.assign(org, data, { updated_at: new Date().toISOString() });
        }
        else {
            org = {
                id: (0, uuid_1.v4)(),
                owner_id: req.user.id,
                ...data,
                verification_status: req.user.role === 'recipient' ? 'pending' : 'verified',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            store_js_1.db.organizations.set(org.id, org);
        }
        res.json({ organization: org });
    }
    static async verifyOrganization(req, res) {
        const id = String(req.params.id);
        const { status } = req.body; // 'verified' | 'rejected' | 'suspended'
        if (!['verified', 'rejected', 'suspended'].includes(status)) {
            res.status(400).json({ error: 'Invalid verification status' });
            return;
        }
        const org = store_js_1.db.organizations.get(id);
        if (!org) {
            res.status(404).json({ error: 'Organization not found' });
            return;
        }
        org.verification_status = status;
        org.updated_at = new Date().toISOString();
        // Notify organization owner
        store_js_1.db.createNotification({
            user_id: org.owner_id,
            title: 'Organization Verification Update 📋',
            message: `Your organization "${org.organization_name}" verification status is now: ${status.toUpperCase()}.`,
            type: 'verification_update',
            link_url: '/recipient/profile',
        });
        res.json({ message: `Organization marked as ${status}`, organization: org });
    }
}
exports.OrganizationController = OrganizationController;
//# sourceMappingURL=organizationController.js.map