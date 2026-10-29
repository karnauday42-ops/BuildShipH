import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { apiRequest } from '../../lib/api.js';
import { FoodListing, DonationRequest, ImpactSummary } from '../../types/index.js';
import { DashboardLayout } from '../../components/layout/DashboardLayout.js';
import { MetricCard } from '../../components/ui/MetricCard.js';
import { UrgencyBadge } from '../../components/ui/UrgencyBadge.js';
import {
  Utensils,
  FileCheck2,
  Leaf,
  Clock,
  MapPin,
  ArrowRight,
  AlertTriangle,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export const RecipientDashboard: React.FC = () => {
  const { user, organization } = useAuth();
  const [nearbyListings, setNearbyListings] = useState<FoodListing[]>([]);
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [impact, setImpact] = useState<ImpactSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    Promise.all([
      apiRequest<{ listings: FoodListing[] }>('/listings?status=available'),
      apiRequest<{ requests: DonationRequest[] }>('/requests/recipient'),
      apiRequest<ImpactSummary>('/impact/recipient'),
    ])
      .then(([listingsRes, requestsRes, impactRes]) => {
        setNearbyListings(listingsRes.listings);
        setRequests(requestsRes.requests);
        setImpact(impactRes);
      })
      .catch(err => {
        console.error('Error fetching recipient dashboard:', err);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const activeRequests = requests.filter(r => r.status === 'pending' || r.status === 'approved');
  const urgentSurplus = nearbyListings.filter(
    l => l.advisory?.urgency_level === 'CRITICAL' || l.advisory?.urgency_level === 'HIGH'
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              Recipient Organization Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Organization: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{organization?.organization_name || user?.full_name}</span> • Intake capacity: {organization?.capacity_kg || 200} kg
            </p>
          </div>

          <Link
            to="/recipient/available-food"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition self-start sm:self-auto"
          >
            <Utensils className="h-4 w-4" />
            <span>Browse Surplus Food</span>
          </Link>
        </div>

        {/* Verification Status Warning if Pending */}
        {organization && organization.verification_status === 'pending' && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold">Verification Pending</h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                Your non-profit organization credentials are currently under administrative review. You can browse food, and verified status will unlock expedited pickup coordination.
              </p>
            </div>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Available Surplus"
            value={nearbyListings.length}
            subtitle={`${urgentSurplus.length} high priority items`}
            icon={Utensils}
            colorScheme="emerald"
          />
          <MetricCard
            title="Active Requests"
            value={activeRequests.length}
            subtitle={`${requests.filter(r => r.status === 'approved').length} approved for pickup`}
            icon={FileCheck2}
            colorScheme="amber"
          />
          <MetricCard
            title="Food Rescued"
            value={`${impact?.total_rescued_kg || 0} kg`}
            subtitle="Received from local donors"
            icon={Leaf}
            colorScheme="blue"
          />
          <MetricCard
            title="Meals Distributed"
            value={impact?.total_meals.toLocaleString() || '0'}
            subtitle="To community beneficiaries"
            icon={CheckCircle2}
            colorScheme="purple"
          />
        </div>

        {/* Urgent Surplus Opportunities */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Urgent High-Priority Surplus Nearby ({urgentSurplus.length})
              </h2>
              <p className="text-xs text-stone-500">
                Prepared banquet dishes and dairy requiring rapid intake within tight rescue windows.
              </p>
            </div>
            <Link
              to="/recipient/available-food"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              View All Food →
            </Link>
          </div>

          {urgentSurplus.length === 0 ? (
            <p className="text-xs text-stone-400 py-6 text-center">
              No critical urgency listings currently available in your immediate radius.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {urgentSurplus.map(listing => (
                <div
                  key={listing.id}
                  className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        {listing.category}
                      </span>
                      {listing.advisory && (
                        <UrgencyBadge urgency={listing.advisory.urgency_level} showIcon={false} />
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1 line-clamp-1">
                      {listing.food_name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Available: <strong className="text-stone-800 dark:text-stone-200">{listing.remaining_quantity} {listing.quantity_unit}</strong>
                    </p>

                    <div className="mt-2 text-xs text-stone-500 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="truncate">{listing.pickup_address}</span>
                    </div>

                    <div className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Window ends {new Date(listing.pickup_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <Link
                    to={`/recipient/available-food/${listing.id}`}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center transition flex items-center justify-center gap-1.5"
                  >
                    <span>Request Food</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

