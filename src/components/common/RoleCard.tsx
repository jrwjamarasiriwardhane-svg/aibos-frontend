import { useState, useRef } from "react";
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

interface ServiceItem {
  title: string;
  description: string;
  icon: React.ElementType;
  badge: string;
  availability: string;
  glow: string;
  iconBg: string;
  iconColor: string;
}

function Card3DItem({
  service,
  onExplore,
}: {
  service: ServiceItem;
  onExplore: (title: string) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const Icon = service.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRotX(((y - rect.height / 2) / rect.height) * -8);
    setRotY(((x - rect.width / 2) / rect.width) * 8);
    setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  return (
    <div className="[perspective:1000px] w-full">
      <div
        ref={cardRef}
        onClick={() => onExplore(service.title)}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setRotX(0); setRotY(0); }}
        style={{
          transform: isHovered
            ? `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(12px)`
            : "rotateX(0deg) rotateY(0deg) translateZ(0px)",
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
          transformStyle: "preserve-3d",
        }}
        className="group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-950/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-900/90 cursor-pointer min-h-[240px]"
      >
        {/* Cursor glow */}
        {isHovered && (
          <div
            className="pointer-events-none absolute -inset-px rounded-3xl"
            style={{
              background: `radial-gradient(360px circle at ${glowPos.x}% ${glowPos.y}%, ${service.glow}, transparent 50%)`,
            }}
          />
        )}

        {/* Top */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div
              style={{ transform: isHovered ? "translateZ(24px)" : "translateZ(0px)", transition: "transform 0.3s ease-out" }}
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${service.iconBg} shadow-lg`}
            >
              <Icon size={22} className={service.iconColor} />
            </div>
            <span
              style={{ transform: isHovered ? "translateZ(16px)" : "translateZ(0px)", transition: "transform 0.3s ease-out" }}
              className="rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-[11px] font-bold text-slate-400"
            >
              {service.badge}
            </span>
          </div>

          <h3
            style={{ transform: isHovered ? "translateZ(28px)" : "translateZ(0px)", transition: "transform 0.3s ease-out" }}
            className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors"
          >
            {service.title}
          </h3>

          <p
            style={{ transform: isHovered ? "translateZ(14px)" : "translateZ(0px)", transition: "transform 0.3s ease-out" }}
            className="mt-2 text-xs leading-relaxed text-slate-500"
          >
            {service.description}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{ transform: isHovered ? "translateZ(18px)" : "translateZ(0px)", transition: "transform 0.3s ease-out" }}
          className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between"
        >
          <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-500" />
            {service.availability}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 transition-all duration-200 group-hover:translate-x-1">
            Book Now <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </div>
  );
}

export default function RoleCards() {
  const navigate = useNavigate();

  const services: ServiceItem[] = [
    {
      title: "Electrician",
      description: "Electrical installation, wiring repair, breaker panel diagnostics, and safety audits",
      icon: Zap,
      badge: "High Demand",
      availability: "Direct Dispatch",
      glow: "rgba(245,158,11,0.15)",
      iconBg: "bg-amber-500/15 border border-amber-500/20",
      iconColor: "text-amber-400",
    },
    {
      title: "Plumber",
      description: "Pipes, emergency leak sealing, water tank overhaul, and sanitary installation",
      icon: Wrench,
      badge: "Emergency Fix",
      availability: "On-Call Nearby",
      glow: "rgba(56,189,248,0.12)",
      iconBg: "bg-cyan-500/15 border border-cyan-500/20",
      iconColor: "text-cyan-400",
    },
    {
      title: "Carpenter",
      description: "Custom furniture crafting, door locks, hinges, and precision woodwork repair",
      icon: Hammer,
      badge: "Verified Skills",
      availability: "Active Category",
      glow: "rgba(16,185,129,0.12)",
      iconBg: "bg-emerald-500/15 border border-emerald-500/20",
      iconColor: "text-emerald-400",
    },
    {
      title: "Painter",
      description: "Interior wall emulsion, exterior protective coating, waterproofing, and finish",
      icon: Paintbrush,
      badge: "AI Matched",
      availability: "Direct Dispatch",
      glow: "rgba(168,85,247,0.12)",
      iconBg: "bg-purple-500/15 border border-purple-500/20",
      iconColor: "text-purple-400",
    },
    {
      title: "AC Repair",
      description: "HVAC cooling setup, compressor servicing, refrigerant refilling, and duct cleaning",
      icon: Snowflake,
      badge: "Certified Techs",
      availability: "On-Call Nearby",
      glow: "rgba(56,189,248,0.12)",
      iconBg: "bg-sky-500/15 border border-sky-500/20",
      iconColor: "text-sky-400",
    },
    {
      title: "Cleaning",
      description: "Deep home sanitation, commercial office cleaning, and upholstery sanitization",
      icon: Sparkles,
      badge: "Eco-Friendly",
      availability: "Active Category",
      glow: "rgba(20,184,166,0.12)",
      iconBg: "bg-teal-500/15 border border-teal-500/20",
      iconColor: "text-teal-400",
    },
    {
      title: "Mechanic",
      description: "Automobile diagnostics, breakdown assistance, battery jump-starts, and tune-ups",
      icon: Car,
      badge: "Mobile Dispatch",
      availability: "Emergency Unit",
      glow: "rgba(236,72,153,0.12)",
      iconBg: "bg-rose-500/15 border border-rose-500/20",
      iconColor: "text-rose-400",
    },
    {
      title: "Construction",
      description: "Structural masonry, renovation specialists, tiling, and licensed builders",
      icon: HardHat,
      badge: "Licensed Teams",
      availability: "Active Category",
      glow: "rgba(99,102,241,0.12)",
      iconBg: "bg-indigo-500/15 border border-indigo-500/20",
      iconColor: "text-indigo-400",
    },
  ];

  return (
    <section id="services" className="bg-[#060913] py-24 relative overflow-hidden border-t border-slate-800/60">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-blue-600/6 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/6 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/40 px-4 py-1.5 text-xs font-mono font-bold text-cyan-300">
            <Sparkles size={14} className="text-cyan-400" />
            <span>High Demand Categories</span>
          </div>

          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Explore Verified <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Specializations</span>
          </h2>

          <p className="mt-4 text-lg text-slate-400 leading-relaxed">
            Discover verified professionals across essential industries. Every provider undergoes background checks and AI skill classification.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card3DItem key={service.title} service={service} onExplore={(t) => navigate(`/services/search?category=${encodeURIComponent(t)}`)} />
          ))}
        </div>

        {/* View All */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => navigate("/services/search")}
            className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-950/30 px-8 py-4 text-sm font-bold text-cyan-300 backdrop-blur-md shadow-sm transition hover:border-cyan-400 hover:bg-cyan-950/50 hover:shadow-cyan-500/10 active:scale-95 cursor-pointer"
          >
            <span>Explore All Skilled Service Categories</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}