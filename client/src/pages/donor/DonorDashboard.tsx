import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { apiRequest } from '../../lib/api.js';
import { FoodListing, DonationRequest, ImpactSummary } from '../../types/index.js';
import { DashboardLayout } from '../../components/layout/DashboardLayout.js';
import { MetricCard } from '../../components/ui/MetricCard.js';
import { UrgencyBadge } from '../../components/ui/UrgencyBadge.js';
import {
  Package,
  FileCheck2,
  Leaf,
  PlusCircle,
  Clock,
  ArrowRight,
  AlertTriangle,
  Flame,
  CheckCircle2,
} from 'lucide-react';

export const DonorDashboard: React.FC = () => {
  const { user, organization } = useAuth();
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [impact, setImpact] = useState<ImpactSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    Promise.all([
      apiRequest<{ listings: FoodListing[] }>(`/listings?donor_id=${user.id}`),
      apiRequest<{ requests: DonationRequest[] }>('/requests/donor'),
      apiRequest<ImpactSummary>('/impact/donor'),
    ])
      .then(([listingsRes, requestsRes, impactRes]) => {
        setListings(listingsRes.listings);
        setRequests(requestsRes.requests);
        setImpact(impactRes);
      })
      .catch(err => {
        console.error('Error fetching donor dashboard data:', err);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const activeListings = listings.filter(
    l => l.status === 'available' || l.status === 'partially_reserved'
  );
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const criticalListings = activeListings.filter(
    l => l.advisory?.urgency_level === 'CRITICAL'
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              Donor Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Welcome back, <span className="font-semibold text-emerald-600 dark:text-emerald-400">{organization?.organization_name || user?.full_name}</span>. Here is your surplus donation overview.
            </p>
          </div>

          <Link
            to="/donor/listings/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition self-start sm:self-auto"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create Surplus Listing</span>
          </Link>
        </div>

        {/* Critical Urgency Warning Banner */}
        {criticalListings.length > 0 && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-800 dark:text-red-300 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-red-500/20 text-red-600 dark:text-red-400 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">
                  {criticalListings.length} Active Listing(s) with CRITICAL Urgency!
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                  Banquet or temperature-sensitive meals must be collected rapidly to preserve food safety.
                </p>
              </div>
            </div>
            <Link
              to="/donor/listings"
              className="text-xs font-bold text-red-700 dark:text-red-400 hover:underline shrink-0"
            >
              View Listings →
            </Link>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Active Listings"
            value={activeListings.length}
            subtitle={`${listings.length} total published`}
            icon={Package}
            colorScheme="emerald"
          />
          <MetricCard
            title="Pending Requests"
            value={pendingRequests.length}
            subtitle="Awaiting your approval"
            icon={FileCheck2}
            colorScheme="amber"
          />
          <MetricCard
            title="Total Rescued"
            value={`${impact?.total_rescued_kg || 0} kg`}
            subtitle={`${impact?.total_meals || 0} meals provided`}
            icon={Leaf}
            colorScheme="blue"
          />
          <MetricCard
            title="CO₂e Avoided"
            value={`${impact?.total_co2_kg || 0} kg`}
            subtitle="Landfill emissions diverted"
            icon={Flame}
            colorScheme="purple"
          />
        </div>

        {/* Action Grid: Pending Requests & Active Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Requests Section */}
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-amber-500" />
                Pending Intake Requests ({pendingRequests.length})
              </h3>
              <Link to="/donor/requests" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                View All
              </Link>
            </div>

            {pendingRequests.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">
                No pending requests. Nearby recipient organizations will be notified as listings are published.
              </p>
            ) : (
              <div className="divide-y divide-stone-100 dark:divide-stone-800 mt-2">
                {pendingRequests.slice(0, 3).map(req => (
                  <div key={req.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {req.organization?.organization_name || req.recipient?.full_name}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        Requested: <strong className="text-stone-700 dark:text-stone-300">{req.requested_quantity} {req.listing?.quantity_unit}</strong> of "{req.listing?.food_name}"
                      </p>
                    </div>
                    <Link
                      to="/donor/requests"
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Listings Section */}
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Package className="h-4 w-4 text-emerald-600" />
                Active Surplus Donations ({activeListings.length})
              </h3>
              <Link to="/donor/listings" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                Manage
              </Link>
            </div>

            {activeListings.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">
                No active listings. Click "Create Surplus Listing" to publish surplus food.
              </p>
            ) : (
              <div className="divide-y divide-stone-100 dark:divide-stone-800 mt-2">
                {activeListings.slice(0, 3).map(listing => (
                  <div key={listing.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                        {listing.food_name}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        Remaining: <span className="font-semibold text-stone-700 dark:text-stone-300">{listing.remaining_quantity} / {listing.quantity} {listing.quantity_unit}</span> • {listing.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {listing.advisory && <UrgencyBadge urgency={listing.advisory.urgency_level} showIcon={false} />}
                      <Link
                        to={`/donor/listings/${listing.id}`}
                        className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

