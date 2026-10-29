import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiRequest } from '../../lib/api.js';
import { FoodListing } from '../../types/index.js';
import { DashboardLayout } from '../../components/layout/DashboardLayout.js';
import { AIAdvisoryCard } from '../../components/ui/AIAdvisoryCard.js';
import { UrgencyBadge } from '../../components/ui/UrgencyBadge.js';
import {
  MapPin,
  Clock,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Building2,
  Package,
} from 'lucide-react';

export const FoodDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<FoodListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestQty, setRequestQty] = useState<number>(10);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    apiRequest<{ listing: FoodListing }>(`/listings/${id}`)
      .then(res => {
        setListing(res.listing);
        setRequestQty(res.listing.remaining_quantity);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await apiRequest('/requests', {
        method: 'POST',
        body: JSON.stringify({
          listing_id: listing.id,
          requested_quantity: Number(requestQty),
          pickup_notes: notes,
        }),
      });

      setSuccessMsg('Donation request sent! The donor has been notified to confirm reservation.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Request submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-12 text-center text-sm text-stone-500">Loading food surplus details...</div>
      </DashboardLayout>
    );
  }

  if (!listing) {
    return (
      <DashboardLayout>
        <div className="py-12 text-center text-sm text-stone-500">Food item not found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          to="/recipient/available-food"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Available Food</span>
        </Link>

        {/* Top Listing Info */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0">
            <img
              src={listing.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}
              alt={listing.food_name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {listing.category}
              </span>
              {listing.advisory && <UrgencyBadge urgency={listing.advisory.urgency_level} />}
            </div>

            <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100">
              {listing.food_name}
            </h1>

            <p className="text-xs text-stone-600 dark:text-stone-300">
              {listing.description || 'No additional description provided.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800">
                <span className="text-stone-400 block text-[11px]">Available Quantity:</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  {listing.remaining_quantity} {listing.quantity_unit}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800">
                <span className="text-stone-400 block text-[11px]">Storage Condition:</span>
                <span className="font-bold text-stone-900 dark:text-stone-100 capitalize">
                  {listing.storage_condition.replace('_', ' ')}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800">
                <span className="text-stone-400 block text-[11px]">Pickup Window Deadline:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {new Date(listing.pickup_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-stone-500 pt-1">
              <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{listing.pickup_address}</span>
            </div>
          </div>
        </div>

        {/* AI Advisory Section */}
        {listing.advisory && (
          <div className="space-y-3">
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              Gemini AI Food Advisory & Handling Protocol
            </h2>
            <AIAdvisoryCard advisory={listing.advisory} />
          </div>
        )}

        {/* Submit Request Box */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Submit Surplus Request
          </h2>

          {successMsg ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="h-5 w-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          ) : (
            <form onSubmit={handleRequest} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Requested Quantity ({listing.quantity_unit}) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={listing.remaining_quantity}
                    required
                    value={requestQty}
                    onChange={e => setRequestQty(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Estimated Pickup Time / Notes
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="e.g. Can pick up in 30 minutes with cooler box"
                    className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
              >
                {submitting ? 'Submitting Request...' : 'Send Request to Donor'}
              </button>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

