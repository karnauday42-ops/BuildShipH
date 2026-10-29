import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { apiRequest } from '../../lib/api.js';
import { FoodListing } from '../../types/index.js';
import { DashboardLayout } from '../../components/layout/DashboardLayout.js';
import { UrgencyBadge } from '../../components/ui/UrgencyBadge.js';
import { SpoilageBadge } from '../../components/ui/SpoilageBadge.js';
import {
  PlusCircle,
  Clock,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Package,
  Search,
} from 'lucide-react';

export const DonorListingsPage: React.FC = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    apiRequest<{ listings: FoodListing[] }>(`/listings?donor_id=${user.id}`)
      .then(res => setListings(res.listings))
      .catch(err => console.error('Failed to load donor listings:', err))
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = listings.filter(l => {
    if (filterStatus !== 'all' && l.status !== filterStatus) return false;
    if (
      searchTerm &&
      !l.food_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !l.category.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              My Surplus Listings
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Manage your food donations, monitor real-time AI spoilage risks, and track reservation statuses.
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

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search food by name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 pl-9 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 dark:bg-stone-800 self-stretch sm:self-auto overflow-x-auto">
            {['all', 'available', 'partially_reserved', 'completed'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
                  filterStatus === status
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="py-12 text-center text-sm text-stone-500">Loading listings...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-3xl p-6">
            <Package className="h-10 w-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-700 dark:text-stone-300">No Listings Found</h3>
            <p className="text-xs text-stone-500 mt-1">
              You haven't published any listings matching the current filter.
            </p>
            <Link
              to="/donor/listings/new"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <PlusCircle className="h-4 w-4" />
              Create your first donation
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(listing => (
              <div
                key={listing.id}
                className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Image & Status Tag */}
                  <div className="relative h-44 w-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <img
                      src={listing.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}
                      alt={listing.food_name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {listing.advisory && (
                        <UrgencyBadge urgency={listing.advisory.urgency_level} />
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          listing.status === 'available'
                            ? 'bg-emerald-600 text-white'
                            : listing.status === 'partially_reserved'
                            ? 'bg-amber-600 text-white'
                            : 'bg-stone-700 text-white'
                        }`}
                      >
                        {listing.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">
                        {listing.category}
                      </span>
                      <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 line-clamp-1 mt-0.5">
                        {listing.food_name}
                      </h3>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400">Available:</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200">
                          {listing.remaining_quantity} / {listing.quantity} {listing.quantity_unit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400">Storage:</span>
                        <span className="font-medium capitalize">{listing.storage_condition.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400">Pickup Ends:</span>
                        <span className="font-medium text-amber-600 dark:text-amber-400">
                          {new Date(listing.pickup_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action buttons */}
                <div className="p-4 pt-0 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2 mt-2">
                  <Link
                    to={`/donor/listings/${listing.id}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-xs text-center hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition flex items-center justify-center gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View & Matches</span>
                  </Link>

                  <Link
                    to={`/donor/listings/${listing.id}/edit`}
                    className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                    title="Edit listing"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

