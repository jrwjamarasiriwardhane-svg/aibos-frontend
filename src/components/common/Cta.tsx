import { Link } from "react-router-dom";
import { User, Briefcase, Building2, ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section id="roles" className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 px-8 py-20 text-center text-white shadow-2xl shadow-blue-700/25 border border-blue-500/30">
          {/* Ambient light circles */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/20">
              <Sparkles size={15} />
              Join The AI Workforce Ecosystem
            </span>

            <h2 className="text-4xl font-extrabold sm:text-6xl leading-tight tracking-tight text-white">
              One Platform. <br />
              <span className="text-cyan-200">Endless Possibilities.</span>
            </h2>

            <p className="mx-auto max-w-2xl text-lg text-blue-100 leading-relaxed font-normal">
              Whether you need instant household repairs, want to earn as a certified professional, or manage enterprise workforce operations — AIBOS connects you effortlessly.
            </p>

            {/* Role Registration CTA Cards */}
            <div className="pt-8 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
              
              {/* Customer CTA */}
              <Link
                to="/customer/register"
                className="group flex flex-col items-center justify-center rounded-2xl bg-white p-6 text-slate-900 shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl active:scale-[0.98]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <User size={24} />
                </div>
                <span className="text-lg font-bold">I Need Services</span>
                <span className="text-xs text-slate-500 mt-1">Hire trusted professionals</span>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                  Sign Up as Customer <ArrowRight size={14} />
                </span>
              </Link>

              {/* Professional CTA */}
              <Link
                to="/professional/register"
                className="group flex flex-col items-center justify-center rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md p-6 text-white shadow-xl transition-all duration-300 hover:bg-white/20 hover:scale-[1.03] active:scale-[0.98]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white mb-3 group-hover:bg-white group-hover:text-indigo-700 transition-colors">
                  <Briefcase size={24} />
                </div>
                <span className="text-lg font-bold">I Am a Professional</span>
                <span className="text-xs text-blue-100 mt-1">Get jobs & grow income</span>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-cyan-300 group-hover:translate-x-1 transition-transform">
                  Join as Professional <ArrowRight size={14} />
                </span>
              </Link>

              {/* Company CTA */}
              <Link
                to="/company/register"
                className="group flex flex-col items-center justify-center rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md p-6 text-white shadow-xl transition-all duration-300 hover:bg-white/20 hover:scale-[1.03] active:scale-[0.98]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white mb-3 group-hover:bg-white group-hover:text-cyan-700 transition-colors">
                  <Building2 size={24} />
                </div>
                <span className="text-lg font-bold">We Are a Business</span>
                <span className="text-xs text-blue-100 mt-1">Manage team workforce</span>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-cyan-300 group-hover:translate-x-1 transition-transform">
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