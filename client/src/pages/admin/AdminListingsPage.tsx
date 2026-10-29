import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api.js';
import { FoodListing } from '../../types/index.js';
import { DashboardLayout } from '../../components/layout/DashboardLayout.js';
import { UrgencyBadge } from '../../components/ui/UrgencyBadge.js';
import { Package, Trash2, MapPin, AlertCircle, Eye } from 'lucide-react';

export const AdminListingsPage: React.FC = () => {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = () => {
    setLoading(true);
    apiRequest<{ listings: FoodListing[] }>('/listings')
      .then(res => setListings(res.listings))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleCancelListing = async (id: string) => {
    if (!confirm('Are you sure you want to delist/cancel this surplus donation?')) return;
    try {
      await apiRequest(`/listings/${id}`, { method: 'DELETE' });
      fetchListings();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel listing');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Surplus Listing Moderation
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Monitor active food donations, audit AI advisories, and delist unsafe or non-compliant postings.
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-stone-500">Loading platform listings...</div>
        ) : (
          <div className="space-y-4">
            {listings.map(l => (
              <div
                key={l.id}
                className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">
                      {l.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        l.status === 'available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : l.status === 'partially_reserved'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {l.status}
                    </span>
                    {l.advisory && <UrgencyBadge urgency={l.advisory.urgency_level} showIcon={false} />}
                  </div>

                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {l.food_name}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    Donor: <strong className="text-stone-800 dark:text-stone-200">{l.donor_name || 'Donor'}</strong> • Available: {l.remaining_quantity} / {l.quantity} {l.quantity_unit}
                  </p>

                  <p className="text-xs text-stone-500 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                    {l.pickup_address}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-stone-800">
                  {l.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancelListing(l.id)}
                      className="px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold transition flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delist Listing</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

