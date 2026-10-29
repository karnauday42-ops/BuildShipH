import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../lib/api.js';
import { FoodListing, FoodCategory, UrgencyLevel } from '../../types/index.js';
import { DashboardLayout } from '../../components/layout/DashboardLayout.js';
import { UrgencyBadge } from '../../components/ui/UrgencyBadge.js';
import { SpoilageBadge } from '../../components/ui/SpoilageBadge.js';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Package,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react';

export const BrowseFoodPage: React.FC = () => {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('All');
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(null);
  const [requestQty, setRequestQty] = useState<number>(10);
  const [requestNotes, setRequestNotes] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);

  const fetchListings = () => {
    setLoading(true);
    let url = '/listings?status=available';
    if (selectedCategory !== 'All') url += `&category=${encodeURIComponent(selectedCategory)}`;
    if (selectedUrgency !== 'All') url += `&urgency=${encodeURIComponent(selectedUrgency)}`;
    if (vegetarianOnly) url += '&vegetarian=true';
    if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

    apiRequest<{ listings: FoodListing[] }>(url)
      .then(res => setListings(res.listings))
      .catch(err => console.error('Failed to load listings:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchListings();
  }, [selectedCategory, selectedUrgency, vegetarianOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings();
  };

  const handleOpenRequest = (listing: FoodListing) => {
    setSelectedListing(listing);
    setRequestQty(listing.remaining_quantity);
    setRequestNotes('');
    setModalError(null);
    setModalSuccess(null);
  };

  const handleCloseModal = () => {
    setSelectedListing(null);
    setModalError(null);
    setModalSuccess(null);
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing) return;
    setModalLoading(true);
    setModalError(null);

    try {
      await apiRequest('/requests', {
        method: 'POST',
        body: JSON.stringify({
          listing_id: selectedListing.id,
          requested_quantity: Number(requestQty),
          pickup_notes: requestNotes,
        }),
      });

      setModalSuccess('Request submitted! The donor will review your pickup reservation.');
      setTimeout(() => {
        handleCloseModal();
        fetchListings();
      }, 2000);
    } catch (err: any) {
      setModalError(err.message || 'Failed to submit request');
    } finally {
      setModalLoading(false);
    }
  };

  const CATEGORIES: FoodCategory[] = [
    'Cooked Meals',
    'Bakery Products',
    'Fruits',
    'Vegetables',
    'Dairy Products',
    'Packaged Food',
    'Grains and Cereals',
    'Other',
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Browse Available Surplus Food
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Discover fresh surplus donations from restaurants, markets, and hotels. Prioritize high-urgency items to prevent waste.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search food by name, ingredients, or keyword..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2.5 pl-10 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 dark:border-stone-800">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === 'All'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                }`}
              >
                All Categories
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Urgency & Vegetarian Switches */}
            <div className="flex items-center gap-3">
              <select
                value={selectedUrgency}
                onChange={e => setSelectedUrgency(e.target.value)}
                className="rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-2.5 py-1 text-xs font-medium text-stone-800 dark:text-stone-200 focus:outline-none"
              >
                <option value="All">All Urgency Levels</option>
                <option value="CRITICAL">Critical Urgency</option>
                <option value="HIGH">High Urgency</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>

              <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={vegetarianOnly}
                  onChange={e => setVegetarianOnly(e.target.checked)}
                  className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                />
                <span>Vegetarian Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="py-12 text-center text-sm text-stone-500">Searching surplus listings...</div>
        ) : listings.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-3xl p-6">
            <Package className="h-10 w-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-700 dark:text-stone-300">No Food Listings Found</h3>
            <p className="text-xs text-stone-500 mt-1">
              Try adjusting your category or urgency filters to discover available surplus food.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <div
                key={listing.id}
                className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
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
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        {listing.category}
                      </span>
                      <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 line-clamp-1 mt-0.5">
                        {listing.food_name}
                      </h3>
                      <p className="text-xs text-stone-500 truncate">
                        Donor: {listing.donor_name || 'Verified Donor'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400">Available:</span>
                        <span className="font-bold text-stone-900 dark:text-stone-100">
                          {listing.remaining_quantity} {listing.quantity_unit}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-stone-400">Storage:</span>
                        <span className="font-medium capitalize">{listing.storage_condition.replace('_', ' ')}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-stone-400">Pickup Ends:</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          {new Date(listing.pickup_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-stone-500 truncate">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{listing.pickup_address}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2 mt-2">
                  <Link
                    to={`/recipient/available-food/${listing.id}`}
                    className="flex-1 py-2 px-3 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs text-center hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                  >
                    View Details
                  </Link>

                  <button
                    onClick={() => handleOpenRequest(listing)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center transition flex items-center justify-center gap-1"
                  >
                    <span>Request Food</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Interactive Request Modal */}
        {selectedListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-2xl relative space-y-4">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="pr-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Request Surplus Intake
                </span>
                <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                  {selectedListing.food_name}
                </h3>
                <p className="text-xs text-stone-500">
                  Donor: {selectedListing.donor_name} • Max Available: {selectedListing.remaining_quantity} {selectedListing.quantity_unit}
                </p>
              </div>

              {modalSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 shrink-0" />
                  <span>{modalSuccess}</span>
                </div>
              ) : (
                <form onSubmit={handleSendRequest} className="space-y-4">
                  {modalError && (
                    <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{modalError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                      Requested Quantity ({selectedListing.quantity_unit}) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedListing.remaining_quantity}
                      required
                      value={requestQty}
                      onChange={e => setRequestQty(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                      Pickup Notes / Estimated Arrival Time
                    </label>
                    <textarea
                      rows={2}
                      value={requestNotes}
                      onChange={e => setRequestNotes(e.target.value)}
                      placeholder="e.g. Hope Food Bank refrigerated van can arrive in 45 minutes."
                      className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 text-xs text-stone-500 space-y-1">
                    <p className="font-semibold text-stone-700 dark:text-stone-300">Pickup Logistics Reminder:</p>
                    <p>• Pickup Address: {selectedListing.pickup_address}</p>
                    <p>• Window Deadline: {new Date(selectedListing.pickup_end_time).toLocaleTimeString()}</p>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={modalLoading}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm disabled:opacity-50"
                    >
                      {modalLoading ? 'Submitting...' : 'Confirm Request'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

