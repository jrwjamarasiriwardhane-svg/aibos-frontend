import { useNavigate } from "react-router-dom";
import {
  Zap,
  Wrench,
  Hammer,
  Paintbrush,
  Snowflake,
  Sparkles,
  Car,
  HardHat,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function RoleCards() {
  const navigate = useNavigate();

  const services = [
    {
      title: "Electrician",
      description: "Electrical installation, wiring repair, and safety maintenance",
      icon: Zap,
      badge: "Top Requested",
      count: "320+ Online",
      color: "from-amber-500/10 to-orange-500/10 text-amber-600",
    },
    {
      title: "Plumber",
      description: "Pipes, emergency leak sealing, and bathroom installation",
      icon: Wrench,
      badge: "Instant Dispatch",
      count: "240+ Online",
      color: "from-blue-500/10 to-cyan-500/10 text-blue-600",
    },
    {
      title: "Carpenter",
      description: "Custom furniture crafting, doors, and woodwork repair",
      icon: Hammer,
      badge: "Verified Pros",
      count: "180+ Online",
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-600",
    },
    {
      title: "Painter",
      description: "Interior wall design, exterior coating, and commercial painting",
      icon: Paintbrush,
      badge: "AI Matched",
      count: "210+ Online",
      color: "from-purple-500/10 to-pink-500/10 text-purple-600",
    },
    {
      title: "AC Repair",
      description: "HVAC cooling setup, gas refilling, and filter servicing",
      icon: Snowflake,
      badge: "Express Fix",
      count: "190+ Online",
      color: "from-sky-500/10 to-blue-500/10 text-sky-600",
    },
    {
      title: "Cleaning",
      description: "Deep home sanitation, office cleaning, and carpet wash",
      icon: Sparkles,
      badge: "Eco-Friendly",
      count: "290+ Online",
      color: "from-teal-500/10 to-emerald-500/10 text-teal-600",
    },
    {
      title: "Mechanic",
      description: "Automobile diagnostics, breakdown assistance, and tune-ups",
      icon: Car,
      badge: "Mobile Units",
      count: "150+ Online",
      color: "from-rose-500/10 to-red-500/10 text-rose-600",
    },
    {
      title: "Construction",
      description: "Structural masons, renovation experts, and building pros",
      icon: HardHat,
      badge: "Licensed Teams",
      count: "110+ Online",
      color: "from-indigo-500/10 to-violet-500/10 text-indigo-600",
    },
  ];

  const handleExplore = (serviceTitle: string) => {
    navigate(`/services/search?category=${encodeURIComponent(serviceTitle)}`);
  };

  return (
    <section id="services" className="bg-slate-50 py-24 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700">
            <Sparkles size={14} />
            <span>High Demand Categories</span>
          </div>

          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Explore Verified <span className="text-blue-600">Services</span>
          </h2>

          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Discover verified professionals across popular industries. Every provider undergoes background checks and AI skill verification.
          </p>
        </div>

        {/* Grid of Service Cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                onClick={() => handleExplore(service.title)}
                className="group relative rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge & Status */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${service.color} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon size={24} />
                    </div>
                    
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 border border-slate-200">
                      {service.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    {service.description}
                  </p>
                </div>

                {/* Footer Action Link */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <ShieldCheck size={13} className="text-emerald-500" />
                    {service.count}
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 transition-all duration-200 group-hover:translate-x-1">
                    Book Now <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => navigate("/services/search")}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-8 py-4 text-sm font-bold text-slate-800 shadow-sm transition hover:border-blue-600 hover:text-blue-600 hover:shadow-md active:scale-95 cursor-pointer"
          >
            <span>Explore All 50+ Skilled Service Categories</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
}