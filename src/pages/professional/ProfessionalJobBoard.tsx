import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Flame,
  ShieldAlert,
  Search,
  DollarSign,
  Calendar,
  CheckCircle2,
  X,
  Loader2,
  Sparkles,
  Send,
  User,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import {
  getAvailableServiceRequests,
  submitQuotation,
} from "../customer/services/serviceRequestService";
import type { ServiceRequest } from "../customer/types/ServiceRequest";

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";

export const ProfessionalJobBoard: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedUrgency, setSelectedUrgency] = useState("All");

  // Quotation Modal State
  const [selectedJobForQuote, setSelectedJobForQuote] =
    useState<ServiceRequest | null>(null);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteDuration, setQuoteDuration] = useState("2-3 hours");
  const [quoteMessage, setQuoteMessage] = useState("");
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);

  // Direct Accept State
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const token = localStorage.getItem("token") || "";

  const loadJobs = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError("");

      const data = await getAvailableServiceRequests(token);
      setRequests(data || []);
    } catch (err: any) {
      console.error("Failed to load jobs:", err);
      setError(err?.message || "Could not retrieve available requests.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Direct Accept Handler
  const handleDirectAccept = async (jobId: string) => {
    try {
      setAcceptingId(jobId);
      setError("");
      const res = await fetch(
        `${API_BASE_URL}/service-requests/${jobId}/accept`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to accept job");

      setSuccess("Job accepted! Added to your active workload.");
      loadJobs(true);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError(err?.message || "Failed to accept job");
    } finally {
      setAcceptingId(null);
    }
  };

  // Submit Quotation Handler
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForQuote || !quoteAmount) return;

    try {
      setQuoteSubmitting(true);
      setError("");

      await submitQuotation(token, selectedJobForQuote._id, {
        amount: Number(quoteAmount),
        estimatedDuration: quoteDuration,
        message: quoteMessage,
      });

      setSuccess("Quotation sent to the customer successfully!");
      setSelectedJobForQuote(null);
      setQuoteAmount("");
      setQuoteMessage("");
      loadJobs(true);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError(err?.message || "Failed to submit quotation");
    } finally {
      setQuoteSubmitting(false);
    }
  };

  // Filter Logic
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      !searchTerm ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      r.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesUrgency =
      selectedUrgency === "All" ||
      (r as any).urgency?.toLowerCase() === selectedUrgency.toLowerCase();

    return matchesSearch && matchesCategory && matchesUrgency;
  });

  const emergencyCount = requests.filter(
    (r: any) => r.urgency === "emergency"
  ).length;
  const urgentCount = requests.filter((r: any) => r.urgency === "urgent").length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xl font-extrabold text-slate-900 tracking-tight">
              AIBOS
            </Link>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-700">Specialist Job Board</span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold font-mono">
                LIVE DISPATCH
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => loadJobs(true)}
              disabled={refreshing}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
              title="Refresh Available Jobs"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            </button>

            <button
              type="button"
              onClick={() => navigate("/professional/dashboard")}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              <ArrowLeft size={16} />
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Banner */}
        <div className="rounded-3xl border border-blue-200/70 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
              <Sparkles size={13} />
              Real-Time Customer Opportunities
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Verified Marketplace Jobs
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Browse direct service requests posted by local customers. Submit competitive bids, review project scopes, or accept high-priority jobs immediately.
            </p>

            {/* Quick telemetry badges */}
            <div className="mt-5 flex flex-wrap gap-2.5">
              <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/15 text-xs flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                <span>{requests.length} Open Requests</span>
              </div>
              {emergencyCount > 0 && (
                <div className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 backdrop-blur border border-rose-400/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-400 animate-ping" />
                  <span>{emergencyCount} Immediate Emergencies</span>
                </div>
              )}
              {urgentCount > 0 && (
                <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 backdrop-blur border border-amber-400/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                  <Flame size={13} />
                  <span>{urgentCount} Priority Urgent</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError("")} className="text-rose-400 hover:text-rose-700">
              <X size={16} />
            </button>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by category, keyword, or area (e.g. Colombo, wiring)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition"
              />
            </div>

            {/* Category Dropdown */}
            <div className="w-full sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition"
              >
                <option value="All">All Categories</option>
                <option value="Electrician">Electrician</option>
                <option value="AC Repair">AC Repair</option>
                <option value="Plumber">Plumber</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Painter">Painter</option>
                <option value="Mason">Mason</option>
                <option value="Mechanic">Mechanic</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Urgency Dropdown */}
            <div className="w-full sm:w-44">
              <select
                value={selectedUrgency}
                onChange={(e) => setSelectedUrgency(e.target.value)}
                className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition"
              >
                <option value="All">All Priorities</option>
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Listings Feed */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 size={32} className="animate-spin text-blue-600" />
            <p className="text-sm">Scanning customer dispatch network...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-16 text-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Briefcase size={26} />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Matching Service Requests</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are currently no open requests matching your filter criteria. Check back in a few minutes or adjust filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRequests.map((job: any) => {
              const customer = job.customer || {};
              const isUrgent = job.urgency === "urgent";
              const isEmergency = job.urgency === "emergency";
              const quotesCount = job.quotations?.length || 0;

              return (
                <div
                  key={job._id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition"
                >
                  <div className="space-y-3">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold">
                        {job.category}
                      </span>

                      {isEmergency ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[11px] font-bold animate-pulse">
                          <ShieldAlert size={12} />
                          EMERGENCY
                        </span>
                      ) : isUrgent ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold">
                          <Flame size={12} />
                          URGENT
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Standard</span>
                      )}
                    </div>

                    {/* Customer Bio */}
                    <div className="flex items-center gap-2.5 pt-1">
                      <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs shrink-0">
                        {customer.fullName ? customer.fullName.charAt(0).toUpperCase() : <User size={14} />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {customer.fullName || "Customer"}
                          </p>
                          <ShieldCheck size={12} className="text-blue-600 shrink-0" />
                        </div>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                          <MapPin size={10} />
                          {job.location}
                        </p>
                      </div>
                    </div>

                    {/* Problem Description */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {job.description}
                    </p>

                    {/* Meta info strip */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                      {job.preferredDate && (
                        <div className="flex items-center gap-1">
                          <Calendar size={12} className="text-slate-400" />
                          <span>{new Date(job.preferredDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {job.budget ? (
                        <div className="flex items-center gap-1 text-slate-700 font-semibold">
                          <DollarSign size={12} className="text-emerald-600" />
                          <span>LKR {job.budget.toLocaleString()}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">Budget: Open</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {quotesCount} {quotesCount === 1 ? "bid" : "bids"}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedJobForQuote(job);
                          setQuoteAmount(job.budget ? String(job.budget) : "");
                        }}
                        className="px-3.5 py-1.5 rounded-xl border border-blue-200 text-blue-600 text-xs font-bold hover:bg-blue-50 transition cursor-pointer"
                      >
                        Submit Bid
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDirectAccept(job._id)}
                        disabled={acceptingId === job._id}
                        className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
                      >
                        {acceptingId === job._id ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={13} />
                        )}
                        <span>Accept</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Quotation Submission Modal */}
      {selectedJobForQuote && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Send size={18} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Submit Quotation
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedJobForQuote.category} for {selectedJobForQuote.location}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedJobForQuote(null)}
                className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleQuoteSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Your Proposed Price (LKR) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min="100"
                    required
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                    placeholder="e.g. 3500"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Estimated Completion Duration
                </label>
                <input
                  type="text"
                  value={quoteDuration}
                  onChange={(e) => setQuoteDuration(e.target.value)}
                  placeholder="e.g. 1-2 hours, Same day, 3 days"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Message / Scope Details
                </label>
                <textarea
                  rows={3}
                  value={quoteMessage}
                  onChange={(e) => setQuoteMessage(e.target.value)}
                  placeholder="Tell the customer what is included (e.g. includes inspection, diagnosis & tool charges)..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedJobForQuote(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={quoteSubmitting || !quoteAmount}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
                >
                  {quoteSubmitting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  <span>Send Quotation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalJobBoard;
