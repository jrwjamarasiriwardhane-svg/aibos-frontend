import {
  Users,
  Building2,
  BriefcaseBusiness,
  Star,
  CheckCircle2,
} from "lucide-react";

const stats = [
  {
    icon: Users,
    number: "10,000+",
    label: "Active Platform Users",
    subtext: "Customers finding services daily",
    color: "from-blue-600 to-indigo-600",
  },
  {
    icon: Building2,
    number: "2,500+",
    label: "Verified Businesses",
    subtext: "Licensed service enterprises",
    color: "from-cyan-600 to-blue-600",
  },
  {
    icon: BriefcaseBusiness,
    number: "50,000+",
    label: "Jobs Successfully Done",
    subtext: "Instant AI matching dispatch",
    color: "from-indigo-600 to-purple-600",
  },
  {
    icon: Star,
    number: "4.95 / 5",
    label: "Average User Rating",
    subtext: "Based on 35k verified reviews",
    color: "from-amber-500 to-orange-500",
  },
];

export default function Stats() {
  return (
    <section id="stats" className="bg-slate-900 py-24 text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-300">
            <CheckCircle2 size={14} className="text-blue-400" />
            Proven Impact & Scale
          </span>

          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
            Trusted by Thousands Across <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Every Industry</span>
          </h2>

          <p className="mt-4 text-lg text-slate-300 leading-relaxed">
            Connecting customers with qualified professionals in real time with high reliability.
          </p>
        </div>

        {/* Stats Card Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="group relative rounded-3xl border border-slate-800 bg-slate-950/60 p-8 text-center backdrop-blur-xl transition-all duration-300 hover:border-slate-700 hover:bg-slate-900 hover:-translate-y-1.5 shadow-xl"
              >
                <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr ${item.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                  <Icon size={30} />
                </div>

                <h3 className="mt-6 text-4xl font-extrabold tracking-tight text-white">
                  {item.number}
                </h3>

                <p className="mt-2 text-base font-bold text-slate-200">
                  {item.label}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {item.subtext}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}