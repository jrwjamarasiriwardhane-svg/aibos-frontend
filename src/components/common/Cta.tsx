import { Link } from "react-router-dom";
import { User, Briefcase, Building2, ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section id="roles" className="py-20 bg-[#060913] relative overflow-hidden border-t border-slate-800/60">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-700/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="relative overflow-hidden rounded-[36px] border border-cyan-400/20 bg-slate-950/80 px-8 py-20 text-center text-white shadow-2xl shadow-cyan-700/10 backdrop-blur-xl">
          {/* Inner glow orbs */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Subtle inner grid */}
          <div
            className="absolute inset-0 rounded-[36px] opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/50 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 backdrop-blur-md">
              <Sparkles size={15} className="text-cyan-400" />
              Join The AI Workforce Ecosystem
            </span>

            <h2 className="text-4xl font-extrabold sm:text-6xl leading-tight tracking-tight text-white">
              One Platform. <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Endless Possibilities.</span>
            </h2>

            <p className="mx-auto max-w-2xl text-lg text-slate-400 leading-relaxed font-normal">
              Whether you need instant household repairs, want to earn as a certified professional, or manage enterprise workforce operations — AIBOS connects you effortlessly.
            </p>

            {/* CTA Cards */}
            <div className="pt-8 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">

              {/* Customer CTA */}
              <Link
                to="/customer/register"
                className="group flex flex-col items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-950/30 p-6 text-white shadow-xl transition-all duration-300 hover:scale-[1.03] hover:border-cyan-400/50 hover:bg-cyan-950/50 hover:shadow-cyan-500/10 active:scale-[0.98] backdrop-blur-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 mb-3 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                  <User size={24} />
                </div>
                <span className="text-lg font-bold text-white">I Need Services</span>
                <span className="text-xs text-slate-400 mt-1">Hire trusted professionals</span>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-cyan-300 group-hover:translate-x-1 transition-transform">
                  Sign Up as Customer <ArrowRight size={14} />
                </span>
              </Link>

              {/* Professional CTA */}
              <Link
                to="/professional/register"
                className="group flex flex-col items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-950/30 p-6 text-white shadow-xl transition-all duration-300 hover:scale-[1.03] hover:border-blue-400/50 hover:bg-blue-950/50 hover:shadow-blue-500/10 active:scale-[0.98] backdrop-blur-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300 mb-3 group-hover:bg-blue-500 group-hover:text-slate-950 transition-colors">
                  <Briefcase size={24} />
                </div>
                <span className="text-lg font-bold text-white">I Am a Professional</span>
                <span className="text-xs text-slate-400 mt-1">Get jobs & grow income</span>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-300 group-hover:translate-x-1 transition-transform">
                  Join as Professional <ArrowRight size={14} />
                </span>
              </Link>

              {/* Company CTA */}
              <Link
                to="/company/register"
                className="group flex flex-col items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-950/30 p-6 text-white shadow-xl transition-all duration-300 hover:scale-[1.03] hover:border-indigo-400/50 hover:bg-indigo-950/50 hover:shadow-indigo-500/10 active:scale-[0.98] backdrop-blur-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 mb-3 group-hover:bg-indigo-500 group-hover:text-slate-950 transition-colors">
                  <Building2 size={24} />
                </div>
                <span className="text-lg font-bold text-white">We Are a Business</span>
                <span className="text-xs text-slate-400 mt-1">Manage team workforce</span>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-300 group-hover:translate-x-1 transition-transform">
                  Register Company <ArrowRight size={14} />
                </span>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}