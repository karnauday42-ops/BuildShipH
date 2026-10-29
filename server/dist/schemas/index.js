"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = exports.RegisterSchema = exports.CreateOrganizationSchema = exports.AIAdvisoryInputSchema = exports.CreateRequestSchema = exports.UpdateListingSchema = exports.CreateListingSchema = exports.BaseListingSchema = exports.OrgTypeEnum = exports.RoleEnum = exports.ListingStatusEnum = exports.StorageConditionEnum = exports.QuantityUnitEnum = exports.FoodCategoryEnum = void 0;
const zod_1 = require("zod");
exports.FoodCategoryEnum = zod_1.z.enum([
    'Cooked Meals',
    'Bakery Products',
    'Fruits',
    'Vegetables',
    'Dairy Products',
    'Packaged Food',
    'Grains and Cereals',
    'Other',
]);
exports.QuantityUnitEnum = zod_1.z.enum([
    'kg',
    'portions',
    'items',
    'boxes',
    'liters',
]);
exports.StorageConditionEnum = zod_1.z.enum([
    'ambient',
    'refrigerated',
    'frozen',
    'hot_holding',
    'dry_storage',
]);
exports.ListingStatusEnum = zod_1.z.enum([
    'draft',
    'available',
    'reserved',
    'partially_reserved',
    'completed',
    'expired',
    'cancelled',
]);
exports.RoleEnum = zod_1.z.enum(['donor', 'recipient', 'admin']);
exports.OrgTypeEnum = zod_1.z.enum([
    'food_bank',
    'ngo',
    'community_kitchen',
    'shelter',
    'restaurant_group',
    'grocery_chain',
    'other',
]);
// 1. Food Listing Base Schema
exports.BaseListingSchema = zod_1.z.object({
    food_name: zod_1.z.string().min(2, 'Food name must be at least 2 characters').max(120),
    category: exports.FoodCategoryEnum,
    description: zod_1.z.string().max(1000).optional().default(''),
    quantity: zod_1.z.number().positive('Quantity must be greater than zero'),
    quantity_unit: exports.QuantityUnitEnum,
    preparation_time: zod_1.z.string().datetime().optional().nullable(),
    best_before_time: zod_1.z.string().datetime().optional().nullable(),
    storage_condition: exports.StorageConditionEnum,
    storage_temperature: zod_1.z.number().optional().nullable(),
    pickup_address: zod_1.z.string().min(5, 'Pickup address is required'),
    pickup_latitude: zod_1.z.number().min(-90).max(90),
    pickup_longitude: zod_1.z.number().min(-180).max(180),
    pickup_start_time: zod_1.z.string().datetime(),
    pickup_end_time: zod_1.z.string().datetime(),
    vegetarian: zod_1.z.boolean().default(false),
    allergens: zod_1.z.array(zod_1.z.string()).default([]),
    packaging_status: zod_1.z.string().min(2).default('sealed_containers'),
    image_url: zod_1.z.string().url().optional().nullable(),
    status: exports.ListingStatusEnum.default('available'),
});
exports.CreateListingSchema = exports.BaseListingSchema.refine(data => new Date(data.pickup_end_time) > new Date(data.pickup_start_time), {
    message: 'Pickup end time must be after pickup start time',
    path: ['pickup_end_time'],
});
exports.UpdateListingSchema = exports.BaseListingSchema.partial();
// 2. Donation Request Schema
exports.CreateRequestSchema = zod_1.z.object({
    listing_id: zod_1.z.string().uuid('Invalid listing ID'),
    requested_quantity: zod_1.z.number().positive('Requested quantity must be greater than zero'),
    pickup_notes: zod_1.z.string().max(500).optional().default(''),
});
// 3. AI Advisory Request Schema
exports.AIAdvisoryInputSchema = zod_1.z.object({
    food_name: zod_1.z.string().min(2),
    category: exports.FoodCategoryEnum,
    description: zod_1.z.string().optional(),
    quantity: zod_1.z.number().positive(),
    quantity_unit: exports.QuantityUnitEnum,
    preparation_time: zod_1.z.string().optional().nullable(),
    best_before_time: zod_1.z.string().optional().nullable(),
    storage_condition: exports.StorageConditionEnum,
    storage_temperature: zod_1.z.number().optional().nullable(),
    packaging_status: zod_1.z.string().optional(),
    allergens: zod_1.z.array(zod_1.z.string()).optional(),
    pickup_end_time: zod_1.z.string().optional(),
});
// 4. Organization Schema
exports.CreateOrganizationSchema = zod_1.z.object({
    organization_name: zod_1.z.string().min(2).max(150),
    organization_type: exports.OrgTypeEnum,
    registration_number: zod_1.z.string().optional().nullable(),
    description: zod_1.z.string().max(1000).optional().nullable(),
    address: zod_1.z.string().min(5),
    city: zod_1.z.string().optional().nullable(),
    state: zod_1.z.string().optional().nullable(),
    postal_code: zod_1.z.string().optional().nullable(),
    latitude: zod_1.z.number().min(-90).max(90),
    longitude: zod_1.z.number().min(-180).max(180),
    capacity_kg: zod_1.z.number().nonnegative().default(100),
    verification_document_url: zod_1.z.string().url().optional().nullable(),
});
// 5. Auth Schemas
exports.RegisterSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    full_name: zod_1.z.string().min(2),
    role: exports.RoleEnum,
    phone: zod_1.z.string().optional().nullable(),
    organization_name: zod_1.z.string().optional(),
    organization_type: exports.OrgTypeEnum.optional(),
    address: zod_1.z.string().optional(),
    latitude: zod_1.z.number().optional(),
    longitude: zod_1.z.number().optional(),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1, 'Password is required'),
});
//# sourceMappingURL=index.js.map