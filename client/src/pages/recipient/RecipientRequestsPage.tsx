import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api.js';
import { DonationRequest } from '../../types/index.js';
import { DashboardLayout } from '../../components/layout/DashboardLayout.js';
import {
  FileCheck2,
  CheckCircle,
  Clock,
  MapPin,
  CheckCheck,
  AlertCircle,
  Building2,
  Package,
} from 'lucide-react';

export const RecipientRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const res = await apiRequest<{ requests: DonationRequest[] }>('/requests/recipient');
      setRequests(res.requests);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleConfirmCollection = async (requestId: string) => {
    setActionLoading(requestId);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await apiRequest(`/requests/${requestId}/confirm-pickup`, { method: 'POST' });
      setSuccessMsg(res.message);
      fetchRequests();
    } catch (err: any) {
      setErrorMsg(err.message || 'Collection confirmation failed');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            My Donation Requests
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Track your surplus food requests, obtain pickup authorization, and confirm physical collections.
          </p>
        </div>

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-sm text-stone-500">Loading your requests...</div>
        ) : requests.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-3xl p-6">
            <FileCheck2 className="h-10 w-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-700 dark:text-stone-300">No Submitted Requests</h3>
            <p className="text-xs text-stone-500 mt-1">
              Browse available surplus food to submit your first donation pickup request.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(req => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        req.status === 'pending'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : req.status === 'approved'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                          : req.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300'
                      }`}
                    >
                      {req.status}
                    </span>
                    <span className="text-xs text-stone-400">
                      Submitted {new Date(req.created_at).toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {req.listing?.food_name || 'Food Donation'}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    Requested: <strong className="text-stone-900 dark:text-stone-100">{req.requested_quantity} {req.listing?.quantity_unit}</strong> • Donor: {req.listing?.donor_name || 'Verified Kitchen'}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-stone-500">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>{req.listing?.pickup_address}</span>
                  </div>

                  {req.rejection_reason && (
                    <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-2 rounded-lg">
                      Decline reason: {req.rejection_reason}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-stone-800">
                  {req.status === 'pending' && (
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Awaiting Donor Approval
                    </span>
                  )}

                  {req.status === 'approved' && (
                    <button
                      onClick={() => handleConfirmCollection(req.id)}
                      disabled={actionLoading === req.id || req.collection_confirmed_by_recipient}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition flex items-center gap-1.5 ${
                        req.collection_confirmed_by_recipient
                          ? 'bg-stone-100 dark:bg-stone-800 text-stone-500 cursor-default'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <CheckCheck className="h-4 w-4" />
                      <span>
                        {req.collection_confirmed_by_recipient
                          ? '✓ Pickup Confirmed (Waiting for Donor)'
                          : 'Confirm Food Collection'}
                      </span>
                    </button>
                  )}

                  {req.status === 'completed' && (
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="h-4 w-4" />
                      <span>Collection Completed</span>
                    </div>
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

