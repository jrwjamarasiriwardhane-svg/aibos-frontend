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
    <section className="relative overflow-hidden bg-[#060913] text-white pt-8 pb-14 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-28">
      {/* HUD Radial Ambient Light Gradients */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[350px] sm:w-[700px] h-[300px] sm:h-[600px] bg-blue-600/15 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-5 sm:right-10 w-[300px] sm:w-[600px] h-[250px] sm:h-[500px] bg-cyan-500/10 rounded-full blur-[90px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-indigo-600/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      {/* Cyber Grid Background Matrix Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid items-center gap-8 md:gap-10 lg:gap-12 lg:grid-cols-12">
          
          {/* LEFT CONTENT & COMMAND SEARCH INTERFACE */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-7 text-left">
            
            {/* Live Telemetry System Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/40 px-3.5 py-1 text-[11px] sm:text-xs font-mono font-bold text-cyan-300 backdrop-blur-md shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <Sparkles size={13} className="text-cyan-400" />
              <span>{t("hero.badge") || "AI DISPATCH ENGINE ACTIVE"}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] sm:leading-[1.12]">
              {t("hero.titlePrefix") || "Autonomous AI Matching for"}{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent block sm:inline">
                {t("hero.titleSuffix") || "Verified Professionals"}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed font-normal">
              {t("hero.subtitle") ||
                "Instantly match your technical needs with nearby certified specialists — electricians, plumbers, HVAC mechanics, carpenters, and painters dispatched in real time."}
            </p>

            {/* HUD COMMAND SEARCH BAR */}
            <div className="w-full max-w-2xl rounded-2xl sm:rounded-3xl border border-cyan-500/25 bg-slate-950/80 p-2 sm:p-3 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
              <div className="flex flex-col gap-2 md:flex-row md:items-center">

                {/* Location Selector */}
                <div className="flex items-center gap-2 rounded-xl sm:rounded-2xl bg-slate-900/90 px-3.5 py-3 border border-slate-800 md:w-44 shrink-0">
                  <MapPin size={17} className="text-cyan-400 shrink-0" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-200 outline-none cursor-pointer"
                  >
                    <option value="Colombo" className="bg-slate-900 text-white">🇱🇰 Colombo, LK</option>
                    <option value="Kandy" className="bg-slate-900 text-white">🇱🇰 Kandy, LK</option>
                    <option value="Galle" className="bg-slate-900 text-white">🇱🇰 Galle, LK</option>
                    <option value="Ambalangoda" className="bg-slate-900 text-white">🇱🇰 Ambalangoda, LK</option>
                    <option value="Mumbai" className="bg-slate-900 text-white">🇮🇳 Mumbai, IN</option>
                    <option value="Delhi" className="bg-slate-900 text-white">🇮🇳 New Delhi, IN</option>
                    <option value="Bangalore" className="bg-slate-900 text-white">🇮🇳 Bengaluru, IN</option>
                    <option value="Dubai" className="bg-slate-900 text-white">🇦🇪 Dubai, UAE</option>
                    <option value="Singapore" className="bg-slate-900 text-white">🇸🇬 Singapore, SG</option>
                    <option value="London" className="bg-slate-900 text-white">🇬🇧 London, UK</option>
                    <option value="Frankfurt" className="bg-slate-900 text-white">🇩🇪 Frankfurt, DE</option>
                    <option value="Tokyo" className="bg-slate-900 text-white">🇯🇵 Tokyo, JP</option>
                    <option value="Sydney" className="bg-slate-900 text-white">🇦🇺 Sydney, AU</option>
                    <option value="New York" className="bg-slate-900 text-white">🇺🇸 New York, US</option>
                  </select>
                </div>

                {/* Search Input */}
                <div className="flex flex-1 items-center gap-2.5 px-3 py-2 bg-slate-900/40 rounded-xl sm:bg-transparent sm:rounded-none">
                  <Search size={18} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                    placeholder={t("hero.searchPlaceholder") || "What service do you need? (e.g. Electrician)"}
                    className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none font-medium"
                  />
                </div>

                {/* Match AI Action Button */}
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={isSearching || !search.trim()}
                  className="flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-cyan-600/25 transition duration-200 hover:from-blue-500 hover:to-cyan-500 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer active:scale-95"
                >
                  {isSearching ? (
                    <span className="flex items-center gap-2">
                      <Radio size={15} className="animate-spin" />
                      {t("hero.matching") || "Matching..."}
                    </span>
                  ) : (
                    <>
                      <span>{t("hero.matchAi") || "Match AI"}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

              </div>
            </div>

            {/* Quick Search Service Chips */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider">
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
                  className="rounded-full border border-slate-800 bg-slate-900/80 px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-slate-300 transition hover:border-cyan-400 hover:text-white hover:bg-cyan-950/30 cursor-pointer text-[11px] sm:text-xs"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Qualitative Value Propositions */}
            <div className="pt-3 sm:pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t border-slate-800/80 max-w-xl">
              <div className="space-y-0.5 sm:space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs sm:text-sm">
                  <Zap size={15} />
                  <span>Proximity</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium">GPS-based instant routing</p>
              </div>

              <div className="space-y-0.5 sm:space-y-1 border-t sm:border-t-0 sm:border-x border-slate-800/80 pt-2 sm:pt-0 sm:px-3">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs sm:text-sm">
                  <ShieldCheck size={15} />
                  <span>Verified</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium">Government ID & skills checked</p>
              </div>

              <div className="space-y-0.5 sm:space-y-1 border-t sm:border-t-0 border-slate-800/80 pt-2 sm:pt-0 sm:pl-1">
                <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs sm:text-sm">
                  <CheckCircle2 size={15} />
                  <span>Real-Time</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium">Live on-demand availability</p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - LIVE WORKER NETWORK & GLOBE VISUALIZATION */}
          <div className="lg:col-span-5 flex justify-center w-full mt-4 lg:mt-0">
            <WorkerNetworkGlobe />
          </div>

        </div>
      </div>
    </section>
  );
}