import {
  ShieldCheck,
  Zap,
  MapPin,
  Cpu,
  CheckCircle2,
} from "lucide-react";

const platformPillars = [
  {
    icon: Zap,
    tag: "DISPATCH ENGINE",
    title: "Proximity Matching",
    description: "GPS-driven algorithms locate certified specialists in your immediate radius for fast response times.",
    color: "from-cyan-500 to-blue-600 text-cyan-400",
    borderGlow: "hover:border-cyan-500/40",
  },
  {
    icon: ShieldCheck,
    tag: "TRUST & SAFETY",
    title: "Verified Credentials",
    description: "Every professional undergoes identity validation, credential screening, and skill categorization.",
    color: "from-emerald-500 to-teal-600 text-emerald-400",
    borderGlow: "hover:border-emerald-500/40",
  },
  {
    icon: Cpu,
    tag: "INTELLIGENCE",
    title: "Autonomous Routing",
    description: "AI analyzes request descriptions, urgency, and specialized tools to match the best suited technician.",
    color: "from-blue-600 to-indigo-600 text-blue-400",
    borderGlow: "hover:border-blue-500/40",
  },
  {
    icon: MapPin,
    tag: "TRANSPARENCY",
    title: "Real-Time Tracking",
    description: "Full visibility from request creation to dispatch, arrival, job completion, and secure digital sign-off.",
    color: "from-amber-500 to-orange-600 text-amber-400",
    borderGlow: "hover:border-amber-500/40",
  },
];

export default function Stats() {
  return (
    <section id="capabilities" className="bg-[#0b0f19] py-24 text-white relative overflow-hidden border-y border-slate-800/80">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/40 px-4 py-1.5 text-xs font-mono font-bold text-cyan-300">
            <CheckCircle2 size={14} className="text-cyan-400" />
            CORE CAPABILITIES
          </span>

          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
            Built for Precision, <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Speed & Trust</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Eliminating guesswork with an automated dispatcher that pairs service requests with certified professionals.
          </p>
        </div>

        {/* Pillars Card Grid (Honest qualitative architecture) */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {platformPillars.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`group relative rounded-3xl border border-slate-800 bg-slate-950/70 p-7 text-left backdrop-blur-xl transition-all duration-300 hover:bg-slate-900 hover:-translate-y-1.5 shadow-xl ${item.borderGlow}`}
              >
                {/* HUD Corner Accent */}
                <div className="absolute top-3 right-3 text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {item.tag}
                </div>

                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr ${item.color} shadow-lg transition-transform duration-300 group-hover:scale-110 mb-6`}>
                  <Icon size={26} />
                </div>

                <h3 className="text-xl font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>

                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-400">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}