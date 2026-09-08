import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Loader2,
  Wrench,
} from "lucide-react";
import { createServiceRequest } from "./services/serviceRequestService";

const RequestService: React.FC = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [budget, setBudget] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  // =====================================================
  // SUBMIT REQUEST
  // =====================================================
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("Your session has expired. Please login again.");
      return;
    }

    if (!category || !description || !location) {
      setError("Please fill in category, description and location.");
      return;
    }

    try {
      setLoading(true);

      await createServiceRequest(token, {
        category,
        description,
        location,
        preferredDate: preferredDate || null,
        preferredTime,
        budget: budget ? Number(budget) : 0,
      });

      setSuccess("Service request created successfully!");

      // Clear form
      setCategory("");
      setDescription("");
      setLocation("");
      setPreferredDate("");
      setPreferredTime("");
      setBudget("");

      // Go to dashboard after short delay
      setTimeout(() => {
        navigate("/customer/dashboard");
      }, 1000);
    } catch (err: any) {
      console.error("CREATE SERVICE REQUEST ERROR:", err);
      setError(err?.message || "Unable to create service request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xl font-extrabold text-slate-900 tracking-tight">
              AIBOS
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-semibold text-slate-600">New Request</span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/customer/dashboard")}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-10">
        {/* Intro */}
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mb-3">
            <Sparkles size={14} className="text-blue-600" />
            AI Service Dispatch
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Request a Verified Service
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
            Tell us what service you need and AIBOS will dispatch certified nearby specialists.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm space-y-5"
        >
          {/* Error Banner */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
              <div>
                <p className="font-semibold text-xs sm:text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {success && (
            <div
              role="status"
              className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
            >
              <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-500" />
              <div>
                <p className="font-semibold text-xs sm:text-sm">{success}</p>
                <p className="text-xs text-emerald-600 mt-0.5">Redirecting to your dashboard...</p>
              </div>
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Service Category <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-10 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="">Select a service category</option>
                <option value="Electrician">⚡ Electrician (Wiring, Inverter, Panels)</option>
                <option value="AC Repair">❄️ AC Repair (Cooling, Gas, Servicing)</option>
                <option value="Plumber">🔧 Plumber (Pipes, Leakage, Pumps)</option>
                <option value="Carpenter">🪚 Carpenter (Woodwork, Furniture, Locks)</option>
                <option value="Painter">🎨 Painter (Interior, Exterior, Waterproof)</option>
                <option value="Mason">🧱 Mason (Construction, Tiling, Structural)</option>
                <option value="Mechanic">🚗 Mechanic (Auto Diagnostics, Breakdown)</option>
                <option value="Cleaning">✨ Cleaning (Home, Commercial, Deep)</option>
                <option value="Restaurant Helper">🍽️ Restaurant Helper</option>
                <option value="Other">🛠️ Other Skilled Work</option>
              </select>
              <Wrench size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Problem Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Describe the issue, work scope, or specific equipment needing attention..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 resize-y min-h-[100px]"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Service Location / Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="e.g. Galle Road, Colombo 03 or Ambalangoda"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {/* Date & Time Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Preferred Date
              </label>
              <div className="relative">
                <Calendar size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Preferred Time
              </label>
              <div className="relative">
                <Clock size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Estimated Budget (Optional)
            </label>
            <div className="relative">
              <DollarSign size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 2500"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-400">
              Assists professionals with quote preparation and quick confirmation.
            </p>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/30 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Dispatching Request...</span>
                </>
              ) : (
                <>
                  <span>Create Service Request</span>
                  <Sparkles size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default RequestService;