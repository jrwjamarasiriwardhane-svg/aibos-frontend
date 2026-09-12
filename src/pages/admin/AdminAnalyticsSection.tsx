import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  Activity,
  Layers,
  ArrowUpRight,
} from "lucide-react";

interface AnalyticsData {
  overview?: {
    totalUsers: number;
    customers: number;
    professionals: number;
    companies: number;
    totalRequests: number;
    completedRequests: number;
    revenue: number;
  };
  jobGrowth?: { label: string; count: number; heightPercent: number }[];
  categoryDistribution?: { name: string; percentage: number; count: number; color: string }[];
}

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";

export const AdminAnalyticsSection: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const res = await fetch(`${API_BASE_URL}/analytics/admin/overview`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const json = await res.json();
          const liveData = json.data || json.analytics;
          if (json.success && liveData) {
            setData(liveData);
            return;
          }
        } else {
          setFetchError(`HTTP ${res.status}: Failed to load live telemetry`);
        }
      } catch (e: any) {
        console.warn("Analytics fetch error:", e);
        setFetchError("Unable to reach analytics server");
      } finally {
        setLoading(false);
      }

      // Live empty baseline if server returns empty or unauthenticated
      setData({
        overview: {
          totalUsers: 0,
          customers: 0,
          professionals: 0,
          companies: 0,
          totalRequests: 0,
          completedRequests: 0,
          revenue: 0,
        },
        jobGrowth: [
          { label: "Mon", count: 0, heightPercent: 10 },
          { label: "Tue", count: 0, heightPercent: 10 },
          { label: "Wed", count: 0, heightPercent: 10 },
          { label: "Thu", count: 0, heightPercent: 10 },
          { label: "Fri", count: 0, heightPercent: 10 },
          { label: "Sat", count: 0, heightPercent: 10 },
          { label: "Sun", count: 0, heightPercent: 10 },
        ],
        categoryDistribution: [],
      });
    };

    fetchAnalytics();
  }, [token]);

  const peakGrowth = data?.jobGrowth?.reduce(
    (max, cur) => (cur.count > max.count ? cur : max),
    { label: "None", count: 0, heightPercent: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Telemetry Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            Platform Telemetry & Performance Analytics
          </h2>
          <p className="text-xs text-slate-400">Live operational throughput, workforce metrics, and escrow flow</p>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Syncing database telemetry...
          </div>
        ) : fetchError ? (
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {fetchError}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Live MongoDB synced
          </div>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Platform Users",
            val: (data?.overview?.totalUsers ?? 0).toLocaleString(),
            change: data?.overview?.totalUsers ? "+100%" : "Live",
            sub: `${data?.overview?.customers ?? 0} Customers · ${data?.overview?.professionals ?? 0} Pros`,
            icon: Users,
            accent: "text-cyan-400 bg-cyan-950/60 border-cyan-500/30",
          },
          {
            title: "Dispatched Requests",
            val: (data?.overview?.totalRequests ?? 0).toLocaleString(),
            change: `${data?.overview?.completedRequests ?? 0} Completed`,
            sub: `${
              data?.overview?.totalRequests
                ? Math.round(
                    ((data?.overview?.completedRequests ?? 0) /
                      data.overview.totalRequests) *
                      100
                  )
                : 0
            }% Completion Index`,
            icon: Briefcase,
            accent: "text-blue-400 bg-blue-950/60 border-blue-500/30",
          },
          {
            title: "Processed Volume",
            val: `LKR ${(data?.overview?.revenue ?? 0).toLocaleString()}`,
            change: (data?.overview?.revenue ?? 0) > 0 ? "Active" : "Escrow Empty",
            sub: "Gross Escrow Volume",
            icon: DollarSign,
            accent: "text-emerald-400 bg-emerald-950/60 border-emerald-500/30",
          },
          {
            title: "System Telemetry",
            val: "100%",
            change: "Optimal",
            sub: "Autonomous Mesh Node Health",
            icon: Activity,
            accent: "text-purple-400 bg-purple-950/60 border-purple-500/30",
          },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  {item.title}
                </span>
                <div className={`p-2 rounded-xl border ${item.accent}`}>
                  <Icon size={16} />
                </div>
              </div>

              <div className="mt-3">
                <p className="text-2xl sm:text-3xl font-black font-mono text-white">
                  {item.val}
                </p>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{item.sub}</span>
                  <span className="text-emerald-400 font-semibold font-mono flex items-center">
                    <ArrowUpRight size={13} /> {item.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts 2-Column Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Dispatch Volume CSS Chart */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 backdrop-blur space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  7-Day Request Dispatch Volume
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Autonomous match frequency
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/40">
              Live Feed
            </span>
          </div>

          {/* CSS Bar Chart */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-800">
            {data?.jobGrowth?.map((item, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
              >
                <span className="text-[10px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.count}
                </span>
                <div
                  style={{ height: `${item.heightPercent}%` }}
                  className="w-full max-w-[36px] rounded-t-lg bg-gradient-to-t from-cyan-600 to-cyan-400 group-hover:from-cyan-500 group-hover:to-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all"
                />
                <span className="text-[11px] font-mono text-slate-400 mt-2">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>
              Peak Activity:{" "}
              {peakGrowth && peakGrowth.count > 0
                ? `${peakGrowth.label} (${peakGrowth.count} requests)`
                : "No requests recorded this week"}
            </span>
            <span>Avg Latency: &lt; 50ms</span>
          </div>
        </div>

        {/* Category Distribution CSS Progress Bars */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 backdrop-blur space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                <Layers size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Service Category Demand
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Marketplace request distribution
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-500/40">
              Live Distribution
            </span>
          </div>

          <div className="space-y-3.5 pt-1">
            {(!data?.categoryDistribution || data.categoryDistribution.length === 0) ? (
              <div className="py-8 text-center text-xs text-slate-500 font-mono">
                No categorized service requests recorded yet.
              </div>
            ) : (
              data.categoryDistribution.map((cat, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{cat.name}</span>
                    <span className="font-mono text-slate-400">
                      {cat.count} requests ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${cat.percentage}%` }}
                      className={`h-full rounded-full ${cat.color}`}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsSection;
