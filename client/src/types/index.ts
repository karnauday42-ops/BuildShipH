export type UserRole = 'donor' | 'recipient' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string | null;
  avatar_url?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type OrgType = 
  | 'food_bank' 
  | 'ngo' 
  | 'community_kitchen' 
  | 'shelter' 
  | 'restaurant_group' 
  | 'grocery_chain' 
  | 'other';

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

export interface Organization {
  id: string;
  owner_id: string;
  organization_name: string;
  organization_type: OrgType;
  registration_number?: string | null;
  description?: string | null;
  address: string;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  latitude: number;
  longitude: number;
  verification_status: VerificationStatus;
  verification_document_url?: string | null;
  capacity_kg: number;
  created_at: string;
  updated_at: string;
}

export type FoodCategory = 
  | 'Cooked Meals'
  | 'Bakery Products'
  | 'Fruits'
  | 'Vegetables'
  | 'Dairy Products'
  | 'Packaged Food'
  | 'Grains and Cereals'
  | 'Other';

export type QuantityUnit = 'kg' | 'portions' | 'items' | 'boxes' | 'liters';

export type StorageCondition = 
  | 'ambient' 
  | 'refrigerated' 
  | 'frozen' 
  | 'hot_holding' 
  | 'dry_storage';

export type ListingStatus = 
  | 'draft'
  | 'available'
  | 'reserved'
  | 'partially_reserved'
  | 'completed'
  | 'expired'
  | 'cancelled';

export type SpoilageRisk = 'LOW' | 'MODERATE' | 'HIGH' | 'UNKNOWN';
export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface AIAdvisory {
  id: string;
  listing_id: string;
  spoilage_risk: SpoilageRisk;
  urgency_level: UrgencyLevel;
  recommended_timeframe_hours: number;
  storage_recommendations: string;
  handling_recommendations: string;
  safety_warnings: string[];
  confidence_level: ConfidenceLevel;
  explanation: string;
  raw_model_response?: any;
  created_at: string;
}

export interface FoodListing {
  id: string;
  donor_id: string;
  organization_id?: string | null;
  food_name: string;
  category: FoodCategory;
  description: string;
  quantity: number;
  remaining_quantity: number;
  quantity_unit: QuantityUnit;
  preparation_time?: string | null;
  best_before_time?: string | null;
  storage_condition: StorageCondition;
  storage_temperature?: number | null;
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  pickup_start_time: string;
  pickup_end_time: string;
  vegetarian: boolean;
  allergens: string[];
  packaging_status: string;
  image_url?: string | null;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
  donor_name?: string;
  advisory?: AIAdvisory | null;
  organization?: Organization | null;
}

export type RequestStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'collected'
  | 'completed'
  | 'cancelled';

export interface DonationRequest {
  id: string;
  listing_id: string;
  recipient_id: string;
  organization_id?: string | null;
  requested_quantity: number;
  status: RequestStatus;
  pickup_notes?: string | null;
  rejection_reason?: string | null;
  collection_confirmed_by_recipient: boolean;
  handover_confirmed_by_donor: boolean;
  collected_at?: string | null;
  created_at: string;
  updated_at: string;
  listing?: FoodListing;
  recipient?: Profile;
  organization?: Organization;
}

export interface ImpactSummary {
  total_rescued_kg: number;
  total_meals: number;
  total_co2_kg: number;
  total_water_liters: number;
  completed_donations_count: number;
  active_listings_count: number;
  participating_donors_count: number;
  participating_recipients_count: number;
  disclaimer: string;
  recent_records?: any[];
}

export interface MatchResult {
  recipient_id: string;
  organization_id: string;
  organization_name: string;
  organization_type: OrgType;
  distance_km: number;
  capacity_kg: number;
  match_score: number;
  match_reasons: string[];
  ai_recommendation_summary?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link_url?: string | null;
  created_at: string;
}

