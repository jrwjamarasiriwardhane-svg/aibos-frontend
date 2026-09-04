import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Search,
  MapPin,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Radio,
} from "lucide-react";
import WorkerNetworkGlobe from "../hero/WorkerNetworkGlobe";

export default function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("Mumbai");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!search.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      navigate(
        `/services/search?q=${encodeURIComponent(
          search
        )}&location=${encodeURIComponent(location)}`
      );
    }, 400);
  };

  return (
    <section className="relative overflow-hidden bg-[#060913] text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* HUD Radial Ambient Light Gradients */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[700px] h-[600px] bg-blue-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[600px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Cyber Grid Background Matrix Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          
          {/* LEFT CONTENT & COMMAND SEARCH INTERFACE */}
          <div className="lg:col-span-7 space-y-7">
            
            {/* Live Telemetry System Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-400/30 bg-cyan-950/40 px-4 py-1.5 text-xs font-mono font-bold text-cyan-300 backdrop-blur-md shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <Sparkles size={14} className="text-cyan-400" />
              <span>{t("hero.badge") || "AI DISPATCH ENGINE ACTIVE"}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-6xl leading-[1.12]">
              {t("hero.titlePrefix") || "Autonomous AI Matching for"}{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                {t("hero.titleSuffix") || "Verified Professionals"}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              {t("hero.subtitle") ||
                "Instantly match your technical needs with nearby certified specialists — electricians, plumbers, HVAC mechanics, carpenters, and painters dispatched in real time."}
            </p>

            {/* HUD COMMAND SEARCH BAR */}
            <div className="max-w-2xl rounded-3xl border border-cyan-500/25 bg-slate-950/80 p-3 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
              <div className="flex flex-col gap-2.5 md:flex-row md:items-center">

                {/* Location Selector */}
                <div className="flex items-center gap-2.5 rounded-2xl bg-slate-900/90 px-4 py-3.5 border border-slate-800 md:w-44 shrink-0">
                  <MapPin size={18} className="text-cyan-400 shrink-0" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-200 outline-none cursor-pointer"
                  >
                    <option value="Mumbai" className="bg-slate-900 text-white">Mumbai</option>
                    <option value="Delhi" className="bg-slate-900 text-white">Delhi</option>
                    <option value="Bangalore" className="bg-slate-900 text-white">Bangalore</option>
                    <option value="Colombo" className="bg-slate-900 text-white">Colombo</option>
                  </select>
                </div>

                {/* Search Input */}
                <div className="flex flex-1 items-center gap-3 px-3 py-2">
                  <Search size={20} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                    placeholder={t("hero.searchPlaceholder") || "What service do you need? (e.g. Electrician)"}
                    className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none font-medium"
                  />
                </div>

                {/* Match AI Action Button */}
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={isSearching || !search.trim()}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-600/25 transition duration-200 hover:from-blue-500 hover:to-cyan-500 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer active:scale-95"
                >
                  {isSearching ? (
                    <span className="flex items-center gap-2">
                      <Radio size={16} className="animate-spin" />
                      {t("hero.matching") || "Matching..."}
                    </span>
                  ) : (
                    <>
                      <span>{t("hero.matchAi") || "Match AI"}</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>

              </div>
            </div>

            {/* Quick Search Service Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300 font-mono text-[11px] uppercase tracking-wider">
                {t("hero.popular") || "Popular"}:
              </span>
              {[
                { label: t("hero.electrician") || "Electrician", value: "Electrician" },
                { label: t("hero.plumber") || "Plumber", value: "Plumber" },
                { label: t("hero.acRepair") || "AC Repair", value: "AC Repair" },
                { label: t("hero.carpenter") || "Carpenter", value: "Carpenter" },
                { label: t("hero.painter") || "Painter", value: "Painter" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setSearch(item.value)}
                  className="rounded-full border border-slate-800 bg-slate-900/80 px-3.5 py-1.5 text-slate-300 transition hover:border-cyan-400 hover:text-white hover:bg-cyan-950/30 cursor-pointer text-xs"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Honest Qualitative Value Propositions (Zero Fabricated / Fake Counts) */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-sm">
                  <Zap size={16} />
                  <span>Proximity</span>
                </div>
                <p className="text-xs text-slate-400 font-medium">GPS-based instant routing</p>
              </div>

              <div className="space-y-1 border-x border-slate-800/80 px-3">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
                  <ShieldCheck size={16} />
                  <span>Verified</span>
                </div>
                <p className="text-xs text-slate-400 font-medium">Government ID & skills checked</p>
              </div>

              <div className="space-y-1 pl-1">
                <div className="flex items-center gap-1.5 text-blue-400 font-bold text-sm">
                  <CheckCircle2 size={16} />
                  <span>Real-Time</span>
                </div>
                <p className="text-xs text-slate-400 font-medium">Live on-demand availability</p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - LIVE WORKER NETWORK & GLOBE VISUALIZATION */}
          <div className="lg:col-span-5 flex justify-center">
            <WorkerNetworkGlobe />
          </div>

        </div>
      </div>
    </section>
  );
}