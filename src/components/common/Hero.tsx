import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import Aiagentlogo from "../../assets/logos/aiagentlogo.png";

export default function Hero() {
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
    <section className="bg-slate-50">
      <div className="mx-auto grid min-h-[85vh] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">

        {/* LEFT */}
        <div>

          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1.5 text-xs font-semibold text-blue-700 backdrop-blur">
            <Sparkles size={15} />
            AI-Powered Workforce Platform
          </div>

          {/* Heading */}
          <h1 className="mt-8 text-5xl font-extrabold leading-tight text-slate-900 lg:text-6xl">
            Find the Right
            <span className="text-blue-600"> Professional</span>
            <br />
            for Any Job.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Tell AIBOS what you need. Our intelligent platform helps you
            discover trusted professionals and businesses based on skills,
            location, availability, and experience.
          </p>

          {/* AI SEARCH */}
          <div className="mt-8 max-w-2xl rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">

            <div className="flex flex-col gap-2 md:flex-row">

              {/* Location */}
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 md:w-40">
                <MapPin
                  size={18}
                  className="text-blue-600"
                />

                <select
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none"
                >
                  <option>Mumbai</option>
                  <option>Delhi</option>
                  <option>Bangalore</option>
                  <option>Colombo</option>
                </select>
              </div>

              {/* Search */}
              <div className="flex flex-1 items-center gap-3 px-3">

                <Search
                  size={20}
                  className="text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  placeholder="What service do you need?"
                  className="w-full bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />

              </div>

              {/* Button */}
              <button
                onClick={handleSearch}
                disabled={isSearching || !search.trim()}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSearching ? (
                  "Finding..."
                ) : (
                  <>
                    Find with AI
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

            </div>
          </div>

          {/* Search examples */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>Try:</span>

            {[
              "Electrician",
              "Plumber",
              "AC Repair",
            ].map((item) => (
              <button
                key={item}
                onClick={() => setSearch(item)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 transition hover:border-blue-300 hover:text-blue-600"
              >
                {item}
              </button>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              to="/customer/register"
              className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Get Started
            </Link>

            <a
              href="#features"
              className="rounded-xl border border-slate-300 bg-white px-7 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Learn More
            </a>

          </div>

          {/* Stats */}
          <div className="mt-10 flex gap-10">

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                10K+
              </h2>
              <p className="text-sm text-slate-500">
                Users
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                2K+
              </h2>
              <p className="text-sm text-slate-500">
                Companies
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                50K+
              </h2>
              <p className="text-sm text-slate-500">
                Jobs
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT — AI AGENT */}
        <div className="flex justify-center">

          <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white shadow-2xl">

            {/* Live badge */}
            <div className="absolute -top-3 left-6 flex items-center gap-2 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white shadow-md">

              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-200 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>

              AI Agent Active

            </div>

            {/* Header */}
            <div className="mt-2 flex items-center justify-between border-b border-slate-800 pb-4">

              <div className="flex items-center gap-4">

                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 p-2 ring-1 ring-blue-500/30">

                  <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl" />

                  <img
                    src={Aiagentlogo}
                    alt="AIBOS AI Agent"
                    className="relative h-16 w-16 object-contain drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                  />

                </div>

                <div>
                  <h3 className="font-bold text-slate-100">
                    AIBOS Workforce AI
                  </h3>

                  <p className="text-xs text-slate-400">
                    Intelligent Matching
                  </p>
                </div>

              </div>

              <span className="rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400 ring-1 ring-blue-500/20">
                AI
              </span>

            </div>

            {/* AI activity */}
            <div className="my-5 space-y-3">

              <div className="rounded-xl bg-slate-800/60 p-4 ring-1 ring-slate-700/50">

                <p className="text-xs text-slate-400">
                  User request
                </p>

                <p className="mt-1 text-sm font-medium text-slate-200">
                  "I need an electrician today"
                </p>

              </div>

              <div className="rounded-xl bg-blue-950/40 p-4 ring-1 ring-blue-500/30">

                <p className="text-xs text-blue-400">
                  AI analyzing
                </p>

                <div className="mt-3 space-y-2 text-xs text-slate-300">

                  <p>✓ Service: Electrical</p>
                  <p>✓ Location: Mumbai</p>
                  <p>✓ Availability: Today</p>
                  <p>✓ Experience required</p>

                </div>

              </div>

              <div className="rounded-xl bg-emerald-950/30 p-4 ring-1 ring-emerald-500/20">

                <p className="text-xs text-emerald-400">
                  Best match found
                </p>

                <div className="mt-2 flex items-center justify-between">

                  <div>
                    <p className="font-semibold text-slate-100">
                      Rohan Sharma
                    </p>

                    <p className="text-xs text-slate-400">
                      ⭐ 4.9 · 287 jobs
                    </p>
                  </div>

                  <span className="rounded-lg bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-400">
                    97% Match
                  </span>

                </div>

              </div>

            </div>

            {/* Prompt */}
            <div className="flex items-center justify-between rounded-xl bg-slate-950 px-4 py-3 text-xs text-slate-400 ring-1 ring-slate-800">

              <span>
                AI understands your requirements
              </span>

              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                AI
              </span>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}