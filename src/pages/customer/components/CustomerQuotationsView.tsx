import React, { useState, useEffect } from "react";
import {
  X,
  Clock,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  User,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import {
  getQuotations,
  acceptQuotation,
  rejectQuotation,
} from "../services/serviceRequestService";

interface Quotation {
  _id: string;
  professional: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    profileImage?: string;
    location?: string;
  };
  amount: number;
  message?: string;
  estimatedDuration?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

interface CustomerQuotationsViewProps {
  requestId: string;
  requestCategory: string;
  requestBudget?: number;
  onClose: () => void;
  onQuotationAccepted?: () => void;
}

export const CustomerQuotationsView: React.FC<CustomerQuotationsViewProps> = ({
  requestId,
  requestCategory,
  requestBudget,
  onClose,
  onQuotationAccepted,
}) => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("token") || "";

  const loadQuotes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getQuotations(token, requestId);
      setQuotations(data || []);
    } catch (err: any) {
      console.error("Error loading quotations:", err);
      setError(err?.message || "Failed to load quotations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, [requestId]);

  const handleAccept = async (quoteId: string) => {
    try {
      setActionLoading(quoteId);
      await acceptQuotation(token, requestId, quoteId);
      setSuccessMessage("Quotation accepted! The specialist has been assigned.");
      setTimeout(() => {
        if (onQuotationAccepted) onQuotationAccepted();
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err?.message || "Failed to accept quotation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (quoteId: string) => {
    try {
      setActionLoading(quoteId);
      await rejectQuotation(token, requestId, quoteId);
      loadQuotes();
    } catch (err: any) {
      setError(err?.message || "Failed to reject quotation");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Specialist Quotations
              </h2>
              <p className="text-xs text-slate-500">
                {requestCategory} &bull;{" "}
                {requestBudget ? `Budget: LKR ${requestBudget.toLocaleString()}` : "Open Budget"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 size={28} className="animate-spin text-blue-600" />
              <p className="text-xs">Fetching professional bids...</p>
            </div>
          ) : quotations.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <MessageSquare size={22} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Quotations Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Nearby verified specialists are reviewing your request. Quotations will appear here as soon as they are submitted.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {quotations.map((quote) => {
                const pro = quote.professional || ({} as any);
                const isAccepted = quote.status === "accepted";
                const isRejected = quote.status === "rejected";

                return (
                  <div
                    key={quote._id}
                    className={`p-4 rounded-2xl border transition ${
                      isAccepted
                        ? "border-emerald-300 bg-emerald-50/50 shadow-sm"
                        : isRejected
                        ? "border-slate-200 bg-slate-50/50 opacity-60"
                        : "border-slate-200 bg-white hover:border-blue-300 shadow-sm"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Professional Bio */}
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0">
                          {pro.fullName ? pro.fullName.charAt(0).toUpperCase() : <User size={18} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">
                              {pro.fullName || "Verified Specialist"}
                            </h4>
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                              <ShieldCheck size={11} />
                              Verified
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {pro.location || "Sri Lanka"}
                          </p>
                        </div>
                      </div>

                      {/* Bid Amount & Time */}
                      <div className="text-left sm:text-right">
                        <p className="text-lg font-black text-blue-600">
                          LKR {quote.amount.toLocaleString()}
                        </p>
                        {quote.estimatedDuration && (
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 sm:justify-end mt-0.5">
                            <Clock size={11} />
                            Est. {quote.estimatedDuration}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quotation Note */}
                    {quote.message && (
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                        &ldquo;{quote.message}&rdquo;
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400">
                        Received {new Date(quote.createdAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-2">
                        {isAccepted ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                            <CheckCircle2 size={13} />
                            Accepted
                          </span>
                        ) : isRejected ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-200 text-slate-600 text-xs font-semibold">
                            Rejected
                          </span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleReject(quote._id)}
                              disabled={actionLoading === quote._id}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                            >
                              Decline
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAccept(quote._id)}
                              disabled={actionLoading === quote._id}
                              className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition cursor-pointer"
                            >
                              {actionLoading === quote._id ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <CheckCircle2 size={13} />
                              )}
                              <span>Accept Bid</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerQuotationsView;
