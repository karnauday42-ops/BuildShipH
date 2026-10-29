import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { apiRequest } from '../../lib/api.js';
import { DashboardLayout } from '../../components/layout/DashboardLayout.js';
import { AIAdvisoryCard } from '../../components/ui/AIAdvisoryCard.js';
import { AIAdvisory, FoodCategory, QuantityUnit, StorageCondition } from '../../types/index.js';
import {
  Sparkles,
  ArrowRight,
  AlertCircle,
  Clock,
  Thermometer,
  ShieldCheck,
  Package,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export const DonorListingNewPage: React.FC = () => {
  const { user, organization } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Cooked Meals');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number>(20);
  const [quantityUnit, setQuantityUnit] = useState<QuantityUnit>('portions');
  const [storageCondition, setStorageCondition] = useState<StorageCondition>('hot_holding');
  const [storageTemp, setStorageTemp] = useState<number | ''>(65);
  const [prepTime, setPrepTime] = useState<string>(() => new Date(Date.now() - 3600000 * 2).toISOString().slice(0, 16));
  const [bestBefore, setBestBefore] = useState<string>(() => new Date(Date.now() + 3600000 * 6).toISOString().slice(0, 16));
  const [pickupStart, setPickupStart] = useState<string>(() => new Date().toISOString().slice(0, 16));
  const [pickupEnd, setPickupEnd] = useState<string>(() => new Date(Date.now() + 3600000 * 4).toISOString().slice(0, 16));
  const [pickupAddress, setPickupAddress] = useState(organization?.address || '120 Mission Street, San Francisco, CA');
  const [vegetarian, setVegetarian] = useState(false);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [packagingStatus, setPackagingStatus] = useState('sealed_aluminum_pans');
  const [imageUrl, setImageUrl] = useState('');

  // AI Advisory preview state
  const [previewAdvisory, setPreviewAdvisory] = useState<AIAdvisory | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ALLERGEN_OPTIONS = [
    'dairy',
    'gluten',
    'eggs',
    'poultry',
    'peanuts',
    'tree_nuts',
    'fish',
    'shellfish',
    'soy',
    'sesame',
  ];

  const handleAllergenToggle = (item: string) => {
    setAllergens(prev =>
      prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]
    );
  };

  const handleRunAiPreview = async () => {
    if (!foodName) {
      setError('Please provide a food name before running AI analysis.');
      return;
    }
    setError(null);
    setAiLoading(true);

    try {
      const res = await apiRequest<{ advisory: AIAdvisory }>('/advisories/preview', {
        method: 'POST',
        body: JSON.stringify({
          food_name: foodName,
          category,
          description,
          quantity: Number(quantity),
          quantity_unit: quantityUnit,
          storage_condition: storageCondition,
          storage_temperature: storageTemp === '' ? undefined : Number(storageTemp),
          packaging_status: packagingStatus,
          allergens,
          pickup_end_time: new Date(pickupEnd).toISOString(),
        }),
      });
      setPreviewAdvisory(res.advisory);
    } catch (err: any) {
      setError(err.message || 'AI Advisory generation failed.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitLoading(true);

    try {
      const payload = {
        food_name: foodName,
        category,
        description,
        quantity: Number(quantity),
        quantity_unit: quantityUnit,
        storage_condition: storageCondition,
        storage_temperature: storageTemp === '' ? undefined : Number(storageTemp),
        preparation_time: new Date(prepTime).toISOString(),
        best_before_time: new Date(bestBefore).toISOString(),
        pickup_start_time: new Date(pickupStart).toISOString(),
        pickup_end_time: new Date(pickupEnd).toISOString(),
        pickup_address: pickupAddress,
        pickup_latitude: organization?.latitude || 37.7749,
        pickup_longitude: organization?.longitude || -122.4194,
        vegetarian,
        allergens,
        packaging_status: packagingStatus,
        image_url: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
        status: 'available',
      };

      const res = await apiRequest<{ listing: any; advisory: any }>('/listings', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      navigate(`/donor/listings/${res.listing.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to publish listing.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Create Food Surplus Listing
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Provide food details. Gemini AI will automatically calculate spoilage risk, urgency level, and safe handling procedures.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Food Details */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              1. Food Identification & Category
            </h2>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                Food Name / Title *
              </label>
              <input
                type="text"
                required
                value={foodName}
                onChange={e => setFoodName(e.target.value)}
                placeholder="e.g. Roasted Chicken & Quinoa Portions"
                className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Food Category *
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as FoodCategory)}
                  className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Cooked Meals">Cooked Meals (Prepared dishes)</option>
                  <option value="Bakery Products">Bakery Products (Breads, pastries)</option>
                  <option value="Fruits">Fruits (Fresh produce)</option>
                  <option value="Vegetables">Vegetables (Fresh produce)</option>
                  <option value="Dairy Products">Dairy Products (Milk, cheeses, yogurt)</option>
                  <option value="Packaged Food">Packaged Food (Sealed shelf-stable)</option>
                  <option value="Grains and Cereals">Grains and Cereals (Rice, pasta)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Packaging Status *
                </label>
                <input
                  type="text"
                  required
                  value={packagingStatus}
                  onChange={e => setPackagingStatus(e.target.value)}
                  placeholder="e.g. sealed_aluminum_pans, food_grade_crates"
                  className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                Description / Ingredients Notes
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Mention prep details, storage handling, or packaging details for the rescue team."
                className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Quantity & Storage Thermal Parameters */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              2. Quantity & Storage Conditions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  required
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Quantity Unit *
                </label>
                <select
                  value={quantityUnit}
                  onChange={e => setQuantityUnit(e.target.value as QuantityUnit)}
                  className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="portions">portions (Prepared meals)</option>
                  <option value="kg">kg (Kilograms)</option>
                  <option value="items">items (Individual units)</option>
                  <option value="boxes">boxes (Produce crates)</option>
                  <option value="liters">liters (Liquid)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Current Storage Condition *
                </label>
                <select
                  value={storageCondition}
                  onChange={e => setStorageCondition(e.target.value as StorageCondition)}
                  className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="hot_holding">Hot Holding (≥ 60°C / 140°F)</option>
                  <option value="refrigerated">Active Refrigeration (≤ 4°C / 40°F)</option>
                  <option value="frozen">Frozen (≤ -18°C / 0°F)</option>
                  <option value="ambient">Ambient Room Temperature</option>
                  <option value="dry_storage">Dry Storage (Pantry/Cellar)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Storage Temperature (°C)
                </label>
                <input
                  type="number"
                  step="any"
                  value={storageTemp}
                  onChange={e => setStorageTemp(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 65 for hot, 3 for cold"
                  className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Preparation / Cooked Time
                </label>
                <input
                  type="datetime-local"
                  value={prepTime}
                  onChange={e => setPrepTime(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Best Before / Target Consumption
                </label>
                <input
                  type="datetime-local"
                  value={bestBefore}
                  onChange={e => setBestBefore(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Dietary & Allergens */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              3. Dietary Classifications & Allergens
            </h2>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="vegCheck"
                checked={vegetarian}
                onChange={e => setVegetarian(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="vegCheck" className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                100% Vegetarian / Plant-Based (Contains no meat or poultry)
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Declare Major Allergens Present:
              </label>
              <div className="flex flex-wrap gap-2">
                {ALLERGEN_OPTIONS.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => handleAllergenToggle(a)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      allergens.includes(a)
                        ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500 font-bold'
                        : 'border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {allergens.includes(a) ? `✓ ${a}` : a}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Pickup Window & Logistics */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              4. Pickup Logistics & Time Window
            </h2>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                Pickup Address *
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  required
                  value={pickupAddress}
                  onChange={e => setPickupAddress(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 pl-9 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                />
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Pickup Window Start *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={pickupStart}
                  onChange={e => setPickupStart(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Pickup Window End (Hard Deadline) *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={pickupEnd}
                  onChange={e => setPickupEnd(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Interactive AI Advisory Preview Trigger */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white dark:from-emerald-950/30 dark:via-stone-900 dark:to-stone-900 border border-emerald-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Gemini AI Spoilage & Urgency Advisory Preview
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Analyze your parameters against food microbiology rules before publishing.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRunAiPreview}
                disabled={aiLoading}
                className="px-4 py-2 rounded-xl bg-white dark:bg-stone-800 border border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {aiLoading ? 'Analyzing Parameters...' : 'Analyze with Gemini AI'}
              </button>
            </div>

            {previewAdvisory && (
              <div className="mt-4">
                <AIAdvisoryCard advisory={previewAdvisory} />
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/donor/listings')}
              className="px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-sm font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitLoading}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition flex items-center gap-2 disabled:opacity-50"
            >
              {submitLoading ? 'Publishing Surplus...' : 'Publish Surplus Listing'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

