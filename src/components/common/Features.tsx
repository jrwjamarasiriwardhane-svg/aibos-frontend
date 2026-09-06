import { useState, useRef } from "react";
import {
  Brain,
  ShieldCheck,
  BarChart3,
  Bell,
  BadgeCheck,
  Zap,
  UserCheck,
  Briefcase,
  Building,
} from "lucide-react";

interface FeatureItem {
  icon: React.ElementType;
  title: string;
  description: string;
  tag: string;
  category: string;
  glow: string;
  iconBg: string;
}

function FeatureCard({ feature }: { feature: FeatureItem }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const Icon = feature.icon;

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
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setRotX(0); setRotY(0); }}
        style={{
          transform: isHovered
            ? `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(14px)`
            : "rotateX(0deg) rotateY(0deg) translateZ(0px)",
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
          transformStyle: "preserve-3d",
        }}
        className="group relative rounded-3xl border border-slate-800 bg-slate-950/80 p-8 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-900/90 cursor-pointer min-h-[280px]"
      >
        {/* Cursor glow */}
        {isHovered && (
          <div
            className="pointer-events-none absolute -inset-px rounded-3xl"
            style={{
              background: `radial-gradient(380px circle at ${glowPos.x}% ${glowPos.y}%, ${feature.glow}, transparent 50%)`,
            }}
          />
        )}

        {/* Icon + Tag row */}
        <div className="flex items-center justify-between">
          <div
            style={{ transform: isHovered ? "translateZ(28px)" : "translateZ(0px)", transition: "transform 0.3s ease-out" }}
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.iconBg} shadow-lg`}
          >
            <Icon size={26} className="text-white" />
          </div>
          <span
            style={{ transform: isHovered ? "translateZ(18px)" : "translateZ(0px)", transition: "transform 0.3s ease-out" }}
            className="rounded-full border border-cyan-400/20 bg-cyan-950/50 px-3 py-1 text-[11px] font-bold text-cyan-300"
          >
            {feature.tag}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{ transform: isHovered ? "translateZ(32px)" : "translateZ(0px)", transition: "transform 0.3s ease-out" }}
          className="mt-6 text-xl font-extrabold text-white group-hover:text-cyan-300 transition-colors"
        >
          {feature.title}
        </h3>

        {/* Description */}
        <p
          style={{ transform: isHovered ? "translateZ(16px)" : "translateZ(0px)", transition: "transform 0.3s ease-out" }}
          className="mt-3 text-sm leading-relaxed text-slate-400"
        >
          {feature.description}
        </p>
      </div>
    </div>
  );
}

export default function Features() {
  const [activeTab, setActiveTab] = useState<"all" | "customer" | "pro" | "company">("all");

  const features: FeatureItem[] = [
    {
      icon: Brain,
      title: "AI Autonomous Matching",
      description: "Smart algorithms match customer job descriptions with verified skills, geographical proximity, and past ratings in milliseconds.",
      tag: "AI Powered",
      category: "customer",
      glow: "rgba(99,102,241,0.18)",
      iconBg: "bg-gradient-to-tr from-blue-500 to-indigo-600",
    },
    {
      icon: ShieldCheck,
      title: "Enterprise-Grade Security",
      description: "Email OTP verification, multi-factor authentication, and encrypted data protection keep every transaction safe.",
      tag: "Bank Security",
      category: "all",
      glow: "rgba(16,185,129,0.15)",
      iconBg: "bg-gradient-to-tr from-emerald-500 to-teal-600",
    },
    {
      icon: BadgeCheck,
      title: "Verified Credentials",
      description: "Multi-step background checks, certification verification, and government ID validation ensure unmatched trust.",
      tag: "Verified",
      category: "pro",
      glow: "rgba(168,85,247,0.15)",
      iconBg: "bg-gradient-to-tr from-purple-500 to-indigo-600",
    },
    {
      icon: BarChart3,
      title: "Workforce Analytics",
      description: "Real-time analytics on staff utilization, job completion rates, customer satisfaction scores, and revenue insights.",
      tag: "Enterprise",
      category: "company",
      glow: "rgba(245,158,11,0.15)",
      iconBg: "bg-gradient-to-tr from-amber-500 to-orange-600",
    },
    {
      icon: Bell,
      title: "Instant Notifications",
      description: "Receive real-time updates on booking confirmations, professional arrival, job status changes, and customer reviews.",
      tag: "Real Time",
      category: "all",
      glow: "rgba(236,72,153,0.15)",
      iconBg: "bg-gradient-to-tr from-rose-500 to-pink-600",
    },
    {
      icon: Zap,
      title: "Fast Booking & Dispatch",
      description: "Streamlined 1-click booking allows customers to request urgent service assistance within 30 seconds.",
      tag: "Speed",
      category: "customer",
      glow: "rgba(34,211,238,0.15)",
      iconBg: "bg-gradient-to-tr from-cyan-500 to-blue-600",
    },
  ];

  const filteredFeatures =
    activeTab === "all" ? features : features.filter((f) => f.category === "all" || f.category === activeTab);

  const tabs = [
    { id: "all", label: "All Features", icon: null },
    { id: "customer", label: "For Customers", icon: UserCheck },
    { id: "pro", label: "For Professionals", icon: Briefcase },
    { id: "company", label: "For Enterprise", icon: Building },
  ] as const;

  return (
    <section id="features" className="bg-[#060913] py-24 relative overflow-hidden border-t border-slate-800/60">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-600/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-600/6 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-950/50 px-4 py-1.5 text-xs font-mono font-bold text-indigo-300">
            <Brain size={14} />
            <span>Why Choose AIBOS</span>
          </div>

          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Engineered for <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Trust, Speed & Intelligence</span>
          </h2>

          <p className="mt-4 text-lg text-slate-400 leading-relaxed">
            Whether you need household repairs, offer professional skills, or manage enterprise workforce — AIBOS delivers end-to-end efficiency.
          </p>

          {/* Role Tabs */}
          <div className="mt-8 inline-flex items-center gap-1 rounded-2xl border border-slate-800 bg-slate-950/80 p-1.5 backdrop-blur-md">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-600/20"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {TabIcon && <TabIcon size={13} />}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D Cards Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFeatures.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}