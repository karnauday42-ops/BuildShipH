import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../../lib/api.js';
import { FoodListing, ListingStatus } from '../../types/index.js';
import { DashboardLayout } from '../../components/layout/DashboardLayout.js';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

export const DonorListingEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [listing, setListing] = useState<FoodListing | null>(null);
  const [foodName, setFoodName] = useState('');
  const [description, setDescription] = useState('');
  const [remainingQuantity, setRemainingQuantity] = useState<number>(0);
  const [pickupAddress, setPickupAddress] = useState('');
  const [status, setStatus] = useState<ListingStatus>('available');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    apiRequest<{ listing: FoodListing }>(`/listings/${id}`)
      .then(res => {
        const l = res.listing;
        setListing(l);
        setFoodName(l.food_name);
        setDescription(l.description);
        setRemainingQuantity(l.remaining_quantity);
        setPickupAddress(l.pickup_address);
        setStatus(l.status);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError(null);
    setSaving(true);

    try {
      await apiRequest(`/listings/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          food_name: foodName,
          description,
          remaining_quantity: Number(remainingQuantity),
          pickup_address: pickupAddress,
          status,
        }),
      });
      navigate(`/donor/listings/${id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to update listing');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-12 text-center text-sm text-stone-500">Loading listing details...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          to={`/donor/listings/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Details</span>
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Edit Food Surplus Listing
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Update listing availability, quantity, or logistics notes.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
              Food Name
            </label>
            <input
              type="text"
              required
              value={foodName}
              onChange={e => setFoodName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                Remaining Available Quantity ({listing?.quantity_unit})
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={remainingQuantity}
                onChange={e => setRemainingQuantity(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                Listing Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as ListingStatus)}
                className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
              >
                <option value="available">Available</option>
                <option value="partially_reserved">Partially Reserved</option>
                <option value="reserved">Fully Reserved</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
              Pickup Address
            </label>
            <input
              type="text"
              required
              value={pickupAddress}
              onChange={e => setPickupAddress(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
              Description / Special Instructions
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => navigate(`/donor/listings/${id}`)}
              className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

