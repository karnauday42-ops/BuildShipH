import { z } from 'zod';

export const FoodCategoryEnum = z.enum([
  'Cooked Meals',
  'Bakery Products',
  'Fruits',
  'Vegetables',
  'Dairy Products',
  'Packaged Food',
  'Grains and Cereals',
  'Other',
]);

export const QuantityUnitEnum = z.enum([
  'kg',
  'portions',
  'items',
  'boxes',
  'liters',
]);

export const StorageConditionEnum = z.enum([
  'ambient',
  'refrigerated',
  'frozen',
  'hot_holding',
  'dry_storage',
]);

export const ListingStatusEnum = z.enum([
  'draft',
  'available',
  'reserved',
  'partially_reserved',
  'completed',
  'expired',
  'cancelled',
]);

export const RoleEnum = z.enum(['donor', 'recipient', 'admin']);

export const OrgTypeEnum = z.enum([
  'food_bank',
  'ngo',
  'community_kitchen',
  'shelter',
  'restaurant_group',
  'grocery_chain',
  'other',
]);

// 1. Food Listing Base Schema
export const BaseListingSchema = z.object({
  food_name: z.string().min(2, 'Food name must be at least 2 characters').max(120),
  category: FoodCategoryEnum,
  description: z.string().max(1000).optional().default(''),
  quantity: z.number().positive('Quantity must be greater than zero'),
  quantity_unit: QuantityUnitEnum,
  preparation_time: z.string().datetime().optional().nullable(),
  best_before_time: z.string().datetime().optional().nullable(),
  storage_condition: StorageConditionEnum,
  storage_temperature: z.number().optional().nullable(),
  pickup_address: z.string().min(5, 'Pickup address is required'),
  pickup_latitude: z.number().min(-90).max(90),
  pickup_longitude: z.number().min(-180).max(180),
  pickup_start_time: z.string().datetime(),
  pickup_end_time: z.string().datetime(),
  vegetarian: z.boolean().default(false),
  allergens: z.array(z.string()).default([]),
  packaging_status: z.string().min(2).default('sealed_containers'),
  image_url: z.string().url().optional().nullable(),
  status: ListingStatusEnum.default('available'),
});

export const CreateListingSchema = BaseListingSchema.refine(
  data => new Date(data.pickup_end_time) > new Date(data.pickup_start_time),
  {
    message: 'Pickup end time must be after pickup start time',
    path: ['pickup_end_time'],
  }
);

export const UpdateListingSchema = BaseListingSchema.partial();

// 2. Donation Request Schema
export const CreateRequestSchema = z.object({
  listing_id: z.string().uuid('Invalid listing ID'),
  requested_quantity: z.number().positive('Requested quantity must be greater than zero'),
  pickup_notes: z.string().max(500).optional().default(''),
});

// 3. AI Advisory Request Schema
export const AIAdvisoryInputSchema = z.object({
  food_name: z.string().min(2),
  category: FoodCategoryEnum,
  description: z.string().optional(),
  quantity: z.number().positive(),
  quantity_unit: QuantityUnitEnum,
  preparation_time: z.string().optional().nullable(),
  best_before_time: z.string().optional().nullable(),
  storage_condition: StorageConditionEnum,
  storage_temperature: z.number().optional().nullable(),
  packaging_status: z.string().optional(),
  allergens: z.array(z.string()).optional(),
  pickup_end_time: z.string().optional(),
});

// 4. Organization Schema
export const CreateOrganizationSchema = z.object({
  organization_name: z.string().min(2).max(150),
  organization_type: OrgTypeEnum,
  registration_number: z.string().optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  address: z.string().min(5),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postal_code: z.string().optional().nullable(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  capacity_kg: z.number().nonnegative().default(100),
  verification_document_url: z.string().url().optional().nullable(),
});

// 5. Auth Schemas
export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().min(2),
  role: RoleEnum,
  phone: z.string().optional().nullable(),
  organization_name: z.string().optional(),
  organization_type: OrgTypeEnum.optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});
