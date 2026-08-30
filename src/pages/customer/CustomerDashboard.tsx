import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Plus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  Activity,
  Zap,
  Star,
  ChevronRight,
  RefreshCw,
  LayoutGrid,
  ListTodo,
  BarChart3,
  AlertCircle,
  Wifi,
  WifiOff,
  Filter,
  X,
  MessageSquare,
  UserCheck,
} from "lucide-react";

import AccountOverview from "./components/AccountOverview";
import CustomerSidebar from "./components/CustomerSidebar";
import CustomerRequestList from "./components/CustomerRequestList";
import NotificationBell from "../../components/notifications/NotificationBell";

import { getMyServiceRequests } from "./services/serviceRequestService";
import type { ServiceRequest } from "./types/ServiceRequest";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface CustomerUser {
  id?: string;
  fullName?: string;
  email?: string;
  role?: string;
  profileImage?: string;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

/** Animated stat card with glow effect */
function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
  glow,
  delta,
  deltaUp,
  suffix = "",
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
  glow: string;
  delta?: string;
  deltaUp?: boolean;
  suffix?: string;
}) {
  const animated = useCountUp(value);
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg ${gradient}`}
      style={{ boxShadow: `0 4px 32px 0 ${glow}` }}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            {label}
          </p>
          <p className="mt-1 text-4xl font-black tabular-nums">
            {animated}
            {suffix}
          </p>
          {delta && (
            <span
              className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${deltaUp
                  ? "bg-emerald-400/20 text-emerald-200"
                  : "bg-red-400/20 text-red-200"
                }`}
            >
              {deltaUp ? (
                <TrendingUp size={10} />
              ) : (
                <TrendingDown size={10} />
              )}
              {delta}
            </span>
          )}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

/** Glassy AI insight card */
function InsightCard({
  title,
  value,
  subtext,
  color,
}: {
  title: string;
  value: string;
  subtext: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {title}
      </p>
      <p className={`mt-1 text-2xl font-black ${color}`}>{value}</p>
      <p className="mt-0.5 text-xs text-slate-500">{subtext}</p>
    </div>
  );
}

/** Activity timeline item */
function TimelineItem({
  icon: Icon,
  color,
  text,
  time,
}: {
  icon: React.ElementType;
  color: string;
  text: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color}`}
      >
        <Icon size={14} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-slate-700">{text}</p>
        <p className="text-[11px] text-slate-400">{time}</p>
      </div>
    </div>
  );
}

/** Quick action pill button */
function QuickAction({
  icon: Icon,
  label,
  onClick,
  variant = "default",
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  variant?: "default" | "primary";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 ${variant === "primary"
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700"
          : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-600"
        }`}
    >
      <Icon size={15} />
      {label}
    </button>
  );
}

/** Skeleton shimmer */
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />;
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ── State ──────────────────────────────────
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("all");
  const searchRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<CustomerUser>(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });
  const [imgError, setImgError] = useState(false);

  const firstName = user?.fullName?.split(" ")[0] || "Customer";
  const firstLetter = user?.fullName?.charAt(0)?.toUpperCase() || "C";

  // ── Online / offline detection ─────────────
  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  // ── Profile handlers ───────────────────────
  const handleImageChange = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    const updatedUser = { ...user, profileImage: previewUrl };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setImgError(false);
  };

  const handleImageDelete = () => {
    const updatedUser = { ...user, profileImage: "" };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setImgError(false);
  };

  // ── Load requests ──────────────────────────
  const loadRequests = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Your session has expired. Please login again.");
        return;
      }
      const data = await getMyServiceRequests(token);
      setRequests(data || []);
    } catch (err: any) {
      console.error("CUSTOMER DASHBOARD REQUEST ERROR:", err);
      setError(
        err?.message ||
        "Unable to connect to the service request server. Showing offline workspace."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // ── Logout ─────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/customer/login");
  };

  // ── Stats ──────────────────────────────────
  const activeRequests = requests.filter((r) =>
    ["pending", "matched", "accepted", "in_progress"].includes(r.status)
  ).length;
  const completedServices = requests.filter((r) => r.status === "completed").length;
  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === "pending").length;
  const satisfactionScore =
    totalRequests === 0
      ? 0
      : Math.round((completedServices / totalRequests) * 100);

  // ── Filtered requests ──────────────────────
  const filteredRequests = requests.filter((r) => {
    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "active"
          ? ["pending", "matched", "accepted", "in_progress"].includes(r.status)
          : r.status === "completed";
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      r.status?.toLowerCase().includes(q) ||
      (r as any).title?.toLowerCase().includes(q) ||
      (r as any).serviceType?.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      {/* ── SIDEBAR ───────────────────────────────────────── */}
      <CustomerSidebar
        activeRequests={activeRequests}
        onLogout={handleLogout}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* ── MAIN ──────────────────────────────────────────── */}
      <main className="min-h-screen lg:ml-64">

        {/* ━━━━━━━ TOP HEADER ━━━━━━━ */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <div className="flex h-16 items-center gap-4 px-5 sm:px-8">
            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>

            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow">
                <Zap size={16} />
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                  Customer Workspace
                </p>
                <p className="text-sm font-black leading-none text-slate-900">AIBOS</p>
              </div>
            </div>

            {/* Global search */}
            <div className="mx-4 hidden flex-1 max-w-md md:flex">
              <div className="relative w-full">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search requests, services…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Right cluster */}
            <div className="ml-auto flex items-center gap-3">
              {/* Online indicator */}
              <span
                className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold sm:inline-flex ${isOnline
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500"
                  }`}
              >
                {isOnline ? <Wifi size={11} /> : <WifiOff size={11} />}
                {isOnline ? "Live" : "Offline"}
              </span>

              {/* Silent refresh */}
              <button
                type="button"
                onClick={() => loadRequests(true)}
                disabled={refreshing}
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
              </button>

              {/* Notifications */}
              <NotificationBell />

              <div className="h-7 w-px bg-slate-200" />

              {/* Avatar */}
              <button
                type="button"
                onClick={() => navigate("/customer/profile")}
                className="flex items-center gap-2.5 rounded-xl px-2 py-1 text-left transition hover:bg-slate-50"
              >
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-bold leading-none text-slate-900">
                    {user?.fullName || "Customer"}
                  </p>
                  <p className="mt-0.5 text-[11px] capitalize text-slate-400">
                    {user?.role || "Customer"}
                  </p>
                </div>
                {user?.profileImage && !imgError ? (
                  <img
                    src={user.profileImage}
                    alt={user.fullName || "avatar"}
                    className="h-9 w-9 rounded-xl object-cover ring-2 ring-blue-100"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-black text-white ring-2 ring-blue-100">
                    {firstLetter}
                  </div>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* ━━━━━━━ PAGE CONTENT ━━━━━━━ */}
        <div className="mx-auto max-w-7xl space-y-7 p-5 sm:p-8">

          {/* ── HERO BANNER ──────────────────────────────── */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 px-8 py-10 text-white shadow-2xl sm:px-12 sm:py-14">
            {/* animated blobs */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-48 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-2xl" />

            <div className="relative">
              <div className="flex flex-wrap items-start justify-between gap-6">
                {/* Left */}
                <div className="max-w-xl">
                  <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
                    AI Business Operating System
                  </span>

                  <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
                    {getGreeting()},{" "}
                    <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                      {firstName}
                    </span>{" "}
                    👋
                  </h2>

                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
                    Your intelligent workspace is ready. Manage service requests,
                    find verified professionals, and track progress — all in one place.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => navigate("/request-service")}
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-xl"
                    >
                      <Plus size={16} />
                      New Service Request
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/services/search")}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                    >
                      Find Professionals
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>

                {/* Right micro-stats (xl only) */}
                <div className="hidden flex-col gap-3 xl:flex">
                  {[
                    { label: "Active", val: activeRequests, color: "text-cyan-300" },
                    { label: "Completed", val: completedServices, color: "text-emerald-300" },
                    { label: "Total", val: totalRequests, color: "text-violet-300" },
                  ].map(({ label, val, color }) => (
                    <div
                      key={label}
                      className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
                        {label}
                      </p>
                      <p className={`text-3xl font-black ${color}`}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── STAT CARDS ───────────────────────────────── */}
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Active Requests"
                value={activeRequests}
                icon={Activity}
                gradient="bg-gradient-to-br from-blue-600 to-blue-700"
                glow="rgba(59,130,246,0.35)"
                delta="+12% this week"
                deltaUp
              />
              <StatCard
                label="Completed"
                value={completedServices}
                icon={CheckCircle2}
                gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
                glow="rgba(16,185,129,0.35)"
                delta="+5% this month"
                deltaUp
              />
              <StatCard
                label="Total Requests"
                value={totalRequests}
                icon={ListTodo}
                gradient="bg-gradient-to-br from-violet-600 to-purple-700"
                glow="rgba(139,92,246,0.35)"
              />
              <StatCard
                label="AI Score"
                value={satisfactionScore}
                icon={Star}
                gradient="bg-gradient-to-br from-amber-500 to-orange-500"
                glow="rgba(245,158,11,0.35)"
                suffix="%"
                delta={satisfactionScore >= 70 ? "Excellent" : "Building up"}
                deltaUp={satisfactionScore >= 70}
              />
            </div>
          )}

          {/* ── MAIN 3-COLUMN GRID ───────────────────────── */}
          <div className="grid gap-7 xl:grid-cols-3">

            {/* Left + Center — 2/3 */}
            <div className="space-y-7 xl:col-span-2">

              {/* Quick Actions toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                <QuickAction
                  icon={Plus}
                  label="New Request"
                  onClick={() => navigate("/request-service")}
                  variant="primary"
                />
                <QuickAction
                  icon={UserCheck}
                  label="Find Professionals"
                  onClick={() => navigate("/services/search")}
                />
                <QuickAction
                  icon={BarChart3}
                  label="My History"
                  onClick={() => navigate("/customer/history")}
                />
                <QuickAction
                  icon={MessageSquare}
                  label="Messages"
                  onClick={() => navigate("/customer/messages")}
                />
              </div>

              {/* ── REQUEST TABLE CARD ──────────────────── */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Card header with tabs + view toggle */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
                  <div>
                    <h3 className="font-bold text-slate-900">Service Requests</h3>
                    <p className="text-xs text-slate-400">
                      {filteredRequests.length} request
                      {filteredRequests.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Tab filters */}
                    <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
                      {(["all", "active", "completed"] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${activeTab === tab
                              ? "bg-white text-blue-600 shadow"
                              : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    {/* View mode toggle */}
                    <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
                      <button
                        type="button"
                        onClick={() => setViewMode("list")}
                        className={`rounded-lg p-1.5 transition ${viewMode === "list"
                            ? "bg-white text-blue-600 shadow"
                            : "text-slate-500 hover:text-slate-700"
                          }`}
                      >
                        <Filter size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("grid")}
                        className={`rounded-lg p-1.5 transition ${viewMode === "grid"
                            ? "bg-white text-blue-600 shadow"
                            : "text-slate-500 hover:text-slate-700"
                          }`}
                      >
                        <LayoutGrid size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-1">
                  <CustomerRequestList
                    requests={filteredRequests}
                    loading={loading}
                    error={error}
                    onRefresh={() => loadRequests(true)}
                    onCreateRequest={() => navigate("/request-service")}
                  />
                </div>
              </div>

              {/* ── EXPLORE DIRECTORY CARD ──────────────── */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        Explore Verified Specialists
                      </h3>
                      <p className="text-xs text-slate-400">
                        Electricians · Plumbers · AC Mechanics · Carpenters & more
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/services/search")}
                    className="hidden items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 sm:flex"
                  >
                    View all <ChevronRight size={14} />
                  </button>
                </div>

                {/* Category chips */}
                <div className="flex flex-wrap gap-2 px-6 pb-5">
                  {[
                    "⚡ Electrician",
                    "🔧 Plumber",
                    "❄️ AC Mechanic",
                    "🪚 Carpenter",
                    "🎨 Painter",
                    "🏠 Handyman",
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => navigate("/services/search")}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* AI directory CTA */}
                <div className="mx-6 mb-6 rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-blue-600 shadow ring-1 ring-slate-100">
                    <ShieldCheck size={28} />
                  </div>
                  <h4 className="mt-4 font-bold text-slate-900">AI-Verified Directory</h4>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                    Browse certified professionals verified by AIBOS — compare skills,
                    ratings, and rates instantly.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/services/search")}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    Browse Directory <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN ────────────────────────────── */}
            <div className="space-y-6">

              {/* AI Insights */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <Sparkles size={15} />
                  </div>
                  <h3 className="font-bold text-slate-900">AI Insights</h3>
                </div>
                <div className="space-y-3">
                  <InsightCard
                    title="Completion Rate"
                    value={`${satisfactionScore}%`}
                    subtext={
                      satisfactionScore >= 70
                        ? "Above average — great work!"
                        : "Keep completing requests to grow"
                    }
                    color="text-violet-600"
                  />
                  <InsightCard
                    title="Pending Actions"
                    value={String(pendingRequests)}
                    subtext="Requests awaiting a professional"
                    color="text-amber-600"
                  />
                  <InsightCard
                    title="Active Jobs"
                    value={String(activeRequests)}
                    subtext="In-progress or matched"
                    color="text-blue-600"
                  />
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Clock size={15} />
                  </div>
                  <h3 className="font-bold text-slate-900">Recent Activity</h3>
                </div>
                <div className="space-y-4">
                  {requests.length === 0 && !loading && (
                    <p className="py-6 text-center text-xs text-slate-400">
                      No activity yet. Create your first request!
                    </p>
                  )}
                  {requests.slice(0, 5).map((req, idx) => {
                    const icons: Record<string, React.ElementType> = {
                      pending: Clock,
                      matched: UserCheck,
                      accepted: CheckCircle2,
                      in_progress: Activity,
                      completed: Star,
                    };
                    const colors: Record<string, string> = {
                      pending: "bg-amber-100 text-amber-600",
                      matched: "bg-blue-100 text-blue-600",
                      accepted: "bg-violet-100 text-violet-600",
                      in_progress: "bg-cyan-100 text-cyan-600",
                      completed: "bg-emerald-100 text-emerald-600",
                    };
                    const Icon = icons[req.status] ?? Clock;
                    const color =
                      colors[req.status] ?? "bg-slate-100 text-slate-500";
                    return (
                      <TimelineItem
                        key={(req as any).id ?? idx}
                        icon={Icon}
                        color={color}
                        text={
                          (req as any).title ||
                          (req as any).serviceType ||
                          `Request #${idx + 1}`
                        }
                        time={`Status: ${req.status}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Upgrade Pro CTA */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-6 text-white shadow-lg">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <div className="relative">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                    <Zap size={18} />
                  </div>
                  <h4 className="mt-3 font-bold">Unlock AIBOS Pro</h4>
                  <p className="mt-1 text-xs leading-relaxed text-violet-200">
                    Priority matching, advanced analytics, and dedicated support.
                  </p>
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-violet-700 transition hover:bg-violet-50"
                  >
                    Upgrade Now <ChevronRight size={13} />
                  </button>
                </div>
              </div>

              {/* Error banner */}
              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-red-500"
                  />
                  <div>
                    <p className="text-sm font-semibold text-red-700">
                      Connection Error
                    </p>
                    <p className="mt-0.5 text-xs text-red-500">{error}</p>
                    <button
                      type="button"
                      onClick={() => loadRequests()}
                      className="mt-2 text-xs font-semibold text-red-600 underline hover:no-underline"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── ACCOUNT OVERVIEW ─────────────────────────── */}
          <AccountOverview
            user={user}
            onImageChange={handleImageChange}
            onImageDelete={handleImageDelete}
          />

          {/* ── FOOTER ───────────────────────────────────── */}
          <footer className="py-6 text-center">
            <p className="text-xs text-slate-400">
              AIBOS · AI Business Operating System · Safe &amp; Secure ·{" "}
              <span className="text-slate-300">v2.0</span>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}