import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api.js';
import { DonationRequest } from '../../types/index.js';
import { DashboardLayout } from '../../components/layout/DashboardLayout.js';
import {
  FileCheck2,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  CheckCheck,
  AlertCircle,
  Building2,
} from 'lucide-react';

export const DonorRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const res = await apiRequest<{ requests: DonationRequest[] }>('/requests/donor');
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

  const handleApprove = async (requestId: string) => {
    setActionLoading(requestId);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await apiRequest(`/requests/${requestId}/approve`, { method: 'POST' });
      setSuccessMsg('Donation request approved! Food quantity reserved atomically.');
      fetchRequests();
    } catch (err: any) {
      setErrorMsg(err.message || 'Approval failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId: string) => {
    const reason = prompt('Please specify a rejection reason for the recipient:');
    if (reason === null) return;

    setActionLoading(requestId);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await apiRequest(`/requests/${requestId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
      setSuccessMsg('Request marked as rejected.');
      fetchRequests();
    } catch (err: any) {
      setErrorMsg(err.message || 'Rejection failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmHandover = async (requestId: string) => {
    setActionLoading(requestId);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await apiRequest(`/requests/${requestId}/confirm-pickup`, { method: 'POST' });
      setSuccessMsg(res.message);
      fetchRequests();
    } catch (err: any) {
      setErrorMsg(err.message || 'Handover confirmation failed');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Incoming Donation Requests
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Review requests from verified recipient charities, approve reservations, and confirm physical handovers.
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
          <div className="py-12 text-center text-sm text-stone-500">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-3xl p-6">
            <FileCheck2 className="h-10 w-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-700 dark:text-stone-300">No Incoming Requests</h3>
            <p className="text-xs text-stone-500 mt-1">
              Recipient organizations will submit requests as they discover your surplus listings.
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
                      Requested {new Date(req.created_at).toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {req.organization?.organization_name || req.recipient?.full_name}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    Requested: <strong className="text-stone-900 dark:text-stone-100">{req.requested_quantity} {req.listing?.quantity_unit}</strong> of "{req.listing?.food_name}"
                  </p>

                  {req.pickup_notes && (
                    <p className="text-xs italic text-stone-500 bg-stone-50 dark:bg-stone-800/60 p-2 rounded-lg">
                      Note from recipient: "{req.pickup_notes}"
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-stone-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" />
                      Type: {req.organization?.organization_type?.replace('_', ' ') || 'Charity'}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {req.organization?.address || 'Local'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-stone-800">
                  {req.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(req.id)}
                        disabled={actionLoading === req.id}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Approve & Reserve</span>
                      </button>

                      <button
                        onClick={() => handleReject(req.id)}
                        disabled={actionLoading === req.id}
                        className="px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {req.status === 'approved' && (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleConfirmHandover(req.id)}
                        disabled={actionLoading === req.id || req.handover_confirmed_by_donor}
                        className={`w-full px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 ${
                          req.handover_confirmed_by_donor
                            ? 'bg-stone-100 dark:bg-stone-800 text-stone-500 cursor-default'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        <CheckCheck className="h-4 w-4" />
                        <span>
                          {req.handover_confirmed_by_donor
                            ? '✓ Handover Confirmed (Waiting for Recipient)'
                            : 'Confirm Physical Handover'}
                        </span>
                      </button>
                    </div>
                  )}

                  {req.status === 'completed' && (
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="h-4 w-4" />
                      <span>Rescued & Completed</span>
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

