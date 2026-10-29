import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiRequest } from '../../lib/api.js';
import { FoodListing, MatchResult } from '../../types/index.js';
import { DashboardLayout } from '../../components/layout/DashboardLayout.js';
import { AIAdvisoryCard } from '../../components/ui/AIAdvisoryCard.js';
import { UrgencyBadge } from '../../components/ui/UrgencyBadge.js';
import {
  MapPin,
  Clock,
  Thermometer,
  Sparkles,
  Building2,
  ArrowLeft,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const DonorListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<FoodListing | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      apiRequest<{ listing: FoodListing }>(`/listings/${id}`),
      apiRequest<{ matches: MatchResult[] }>(`/matching/listing/${id}`),
    ])
      .then(([listingRes, matchesRes]) => {
        setListing(listingRes.listing);
        setMatches(matchesRes.matches);
      })
      .catch(err => console.error('Failed to load listing detail:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-12 text-center text-sm text-stone-500">Loading details...</div>
      </DashboardLayout>
    );
  }

  if (!listing) {
    return (
      <DashboardLayout>
        <div className="py-12 text-center text-sm text-stone-500">Listing not found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <Link
          to="/donor/listings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to My Listings</span>
        </Link>

        {/* Header Hero */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0">
            <img
              src={listing.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}
              alt={listing.food_name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {listing.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-stone-100 dark:bg-stone-800">
                Status: {listing.status.replace('_', ' ')}
              </span>
            </div>

            <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100">
              {listing.food_name}
            </h1>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {listing.description || 'No detailed description specified.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800">
                <span className="text-stone-400 block text-[11px]">Remaining:</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  {listing.remaining_quantity} / {listing.quantity} {listing.quantity_unit}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800">
                <span className="text-stone-400 block text-[11px]">Storage Condition:</span>
                <span className="font-bold text-stone-900 dark:text-stone-100 capitalize">
                  {listing.storage_condition.replace('_', ' ')}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800">
                <span className="text-stone-400 block text-[11px]">Pickup Window:</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  Until {new Date(listing.pickup_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
              Intelligent Food Advisory & Spoilage Analysis
            </h2>
            <AIAdvisoryCard advisory={listing.advisory} />
          </div>
        )}

        {/* Intelligent Matching Results */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-emerald-600" />
                Nearby Verified Recipient Organizations ({matches.length})
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Calculated using Haversine geodesic routing, dietary compatibility, and intake capacity.
              </p>
            </div>
          </div>

          {matches.length === 0 ? (
            <p className="text-xs text-stone-400 py-6 text-center">
              No matching non-profit organizations located within standard radius.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.map(m => (
                <div
                  key={m.organization_id}
                  className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        {m.organization_type.replace('_', ' ')}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                        {m.match_score}% Match
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1">
                      {m.organization_name}
                    </h3>
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {m.distance_km} km away • Capacity: {m.capacity_kg} kg
                    </p>

                    {/* AI Recommendation Summary */}
                    {m.ai_recommendation_summary && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700/60 text-xs italic text-stone-600 dark:text-stone-300">
                        "{m.ai_recommendation_summary}"
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-stone-200 dark:border-stone-700/60 flex flex-wrap gap-1">
                    {m.match_reasons.map((r, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

