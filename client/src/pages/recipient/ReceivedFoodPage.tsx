import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api.js';
import { DonationRequest } from '../../types/index.js';
import { DashboardLayout } from '../../components/layout/DashboardLayout.js';
import { History, Package, MapPin, CheckCircle2 } from 'lucide-react';

export const ReceivedFoodPage: React.FC = () => {
  const [completedRequests, setCompletedRequests] = useState<DonationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<{ requests: DonationRequest[] }>('/requests/recipient')
      .then(res => {
        setCompletedRequests(res.requests.filter(r => r.status === 'completed'));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Received Surplus History
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Complete audit trail of successfully rescued and received food donations.
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-stone-500">Loading history...</div>
        ) : completedRequests.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-3xl p-6">
            <History className="h-10 w-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-700 dark:text-stone-300">No Rescued Food Logged Yet</h3>
            <p className="text-xs text-stone-500 mt-1">
              Once an approved donation has physical pickup confirmed by both parties, it will be permanently archived here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedRequests.map(req => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {req.listing?.category || 'Surplus Food'}
                    </span>
                    <span className="text-xs text-stone-400">
                      Collected {req.collected_at ? new Date(req.collected_at).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mt-1">
                    {req.listing?.food_name}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                    Received: <strong className="text-stone-900 dark:text-stone-100">{req.requested_quantity} {req.listing?.quantity_unit}</strong> • Donor: {req.listing?.donor_name || 'Verified Kitchen'}
                  </p>

                  <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                    {req.listing?.pickup_address}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Verified Dual Confirmation</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

