import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Search,
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";

import Aiagentlogo from "../../assets/logos/aiagentlogo.png";

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
    }, 500);
  };

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white pt-12 pb-24 lg:pt-20 lg:pb-32">
      {/* Background Ambient Glow Accents */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          
          {/* LEFT CONTENT COLUMN */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* AI Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-300 backdrop-blur-md shadow-inner">
              <Sparkles size={16} className="text-blue-400 animate-pulse" />
              <span>{t("hero.badge")}</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-6xl leading-[1.15]">
              {t("hero.titlePrefix")} <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                {t("hero.titleSuffix")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-lg text-slate-300 leading-relaxed font-normal">
              {t("hero.subtitle")}
            </p>

            {/* AI SEARCH BAR CARD */}
            <div className="max-w-2xl rounded-3xl border border-slate-700/80 bg-slate-800/90 p-3 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
              <div className="flex flex-col gap-2.5 md:flex-row md:items-center">

                {/* Location Select */}
                <div className="flex items-center gap-2.5 rounded-2xl bg-slate-900/90 px-4 py-3.5 border border-slate-700/60 md:w-44 shrink-0">
                  <MapPin size={18} className="text-blue-400 shrink-0" />
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
                    placeholder={t("hero.searchPlaceholder")}
                    className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 outline-none"
                  />
                </div>

                {/* Submit Action Button */}
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={isSearching || !search.trim()}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition duration-200 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer"
                >
                  {isSearching ? (
                    <span>{t("hero.matching")}</span>
                  ) : (
                    <>
                      <span>{t("hero.matchAi")}</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>

              </div>
            </div>

            {/* Quick Search Shortcut Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">{t("hero.popular")}:</span>
              {[
                { label: t("hero.electrician"), value: "Electrician" },
                { label: t("hero.plumber"), value: "Plumber" },
                { label: t("hero.acRepair"), value: "AC Repair" },
                { label: t("hero.carpenter"), value: "Carpenter" },
                { label: t("hero.painter"), value: "Painter" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setSearch(item.value)}
                  className="rounded-full border border-slate-700/80 bg-slate-800/60 px-3.5 py-1.5 text-slate-300 transition hover:border-blue-500 hover:text-white hover:bg-blue-600/20 cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Platform Trust Highlights */}
            <div className="pt-4 grid grid-cols-3 gap-6 border-t border-slate-800 max-w-xl">
              <div>
                <p className="text-2xl font-extrabold text-white">10K+</p>
                <p className="text-xs text-slate-400 mt-0.5">{t("hero.verifiedPros")}</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">99.4%</p>
                <p className="text-xs text-slate-400 mt-0.5">{t("hero.aiPrecision")}</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">4.9/5</p>
                <p className="text-xs text-slate-400 mt-0.5">{t("hero.userSat")}</p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - INTERACTIVE AI DEMO CARD */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              
              {/* Outer Glowing Border Effect */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 opacity-35 blur-xl animate-pulse" />

              <div className="relative rounded-3xl border border-slate-800 bg-slate-950/90 p-6 text-white shadow-2xl backdrop-blur-xl">
                
                {/* Status Header Badge */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 p-1.5 ring-1 ring-blue-500/30">
                      <img
                        src={Aiagentlogo}
                        alt="AIBOS AI"
                        className="h-10 w-10 object-contain drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                        {t("hero.engineTitle")}
                        <Zap size={14} className="text-blue-400 fill-blue-400" />
                      </h3>
                      <p className="text-xs text-slate-400">{t("hero.autonomousDispatch")}</p>
                    </div>
                  </div>

                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[11px] font-semibold text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    {t("hero.online")}
                  </span>
                </div>

                {/* AI Processing Flow Simulation */}
                <div className="my-5 space-y-3.5">
                  {/* Step 1 */}
                  <div className="rounded-2xl bg-slate-900/90 p-3.5 border border-slate-800/80">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("hero.userNeed")}</p>
                    <p className="text-sm font-medium text-slate-200 mt-1">{t("hero.userNeedText")}</p>
                  </div>

                  {/* Step 2 */}
                  <div className="rounded-2xl bg-blue-950/40 p-3.5 border border-blue-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">{t("hero.skillLocationSearch")}</span>
                      <span className="text-[10px] text-blue-300 font-mono">0.12s</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300 font-medium">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 size={13} /> {t("hero.verifiedLicense")}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 size={13} /> {t("hero.nearLocation")}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 size={13} /> {t("hero.highRating")}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 size={13} /> {t("hero.instantBooking")}
                      </span>
                    </div>
                  </div>

                  {/* Step 3 - Match Result Card */}
                  <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/90 p-4 border border-emerald-500/40 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white text-sm">
                          RS
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold text-white">Rohan Sharma</p>
                            <ShieldCheck size={15} className="text-blue-400" />
                          </div>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Star size={12} className="text-amber-400 fill-amber-400" /> 4.9 (312 jobs completed)
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className="inline-block rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 text-xs font-bold text-emerald-300">
                          {t("hero.aiMatchBadge")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer badge */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span className="flex items-center gap-1 text-slate-400">
                    <ShieldCheck size={14} className="text-blue-400" /> {t("hero.guaranteed")}
                  </span>
                  <Link to="/services/search" className="text-blue-400 font-semibold hover:underline">
                    {t("hero.exploreAll")}
                  </Link>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}