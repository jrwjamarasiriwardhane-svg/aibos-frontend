import { useState } from "react";
import {
  Brain,
  ShieldCheck,
  BarChart3,
  Bell,
  BadgeCheck,
  Zap,
 // Sparkles,
  UserCheck,
  Briefcase,
  Building,
} from "lucide-react";

export default function Features() {
  const [activeTab, setActiveTab] = useState<"all" | "customer" | "pro" | "company">("all");

  const features = [
    {
      icon: Brain,
      title: "AI Autonomous Matching",
      description: "Smart algorithms match customer job descriptions with verified skills, geographical proximity, and past ratings in milliseconds.",
      tag: "AI Powered",
      category: "customer",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: ShieldCheck,
      title: "Enterprise-Grade Auth & Security",
      description: "Email OTP verification, multi-factor authentication, and encrypted data protection keep every customer and business transaction safe.",
      tag: "Bank Security",
      category: "all",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: BadgeCheck,
      title: "Verified Professional Credentials",
      description: "Multi-step background checks, certification verification, and government ID validation ensure unmatched trust and service quality.",
      tag: "Verified",
      category: "pro",
      gradient: "from-purple-500 to-indigo-600",
    },
    {
      icon: BarChart3,
      title: "Business Workforce Analytics",
      description: "Companies get real-time analytics on staff utilization, job completion rates, customer satisfaction scores, and revenue insights.",
      tag: "Enterprise",
      category: "company",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: Bell,
      title: "Instant Push Notifications",
      description: "Receive instant updates on booking confirmations, professional location arrival, job status changes, and customer reviews.",
      tag: "Real Time",
      category: "all",
      gradient: "from-rose-500 to-pink-600",
    },
    {
      icon: Zap,
      title: "Fast Booking & Dispatch",
      description: "Streamlined 1-click booking interface allows customers to request urgent service assistance within 30 seconds.",
      tag: "Speed",
      category: "customer",
      gradient: "from-cyan-500 to-blue-600",
    },
  ];

  const filteredFeatures = activeTab === "all" ? features : features.filter((f) => f.category === "all" || f.category === activeTab);

  return (
    <section id="features" className="bg-white py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-bold text-indigo-700">
            <Brain size={14} />
            <span>Why Choose AIBOS</span>
          </div>

          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Engineered for <span className="text-blue-600">Trust, Speed & Intelligence</span>
          </h2>

          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Whether you are looking for household repairs, offering professional skills, or managing a company workforce — AIBOS delivers end-to-end efficiency.
          </p>

          {/* Interactive Role Tabs */}
          <div className="mt-8 inline-flex items-center gap-1.5 rounded-2xl bg-slate-100 p-1.5 border border-slate-200">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "all"
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Features
            </button>
            <button
              onClick={() => setActiveTab("customer")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "customer"
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserCheck size={14} />
              For Customers
            </button>
            <button
              onClick={() => setActiveTab("pro")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "pro"
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Briefcase size={14} />
              For Professionals
            </button>
            <button
              onClick={() => setActiveTab("company")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "company"
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building size={14} />
              For Enterprise
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group relative rounded-3xl border border-slate-200/80 bg-slate-50/50 p-8 shadow-sm transition-all duration-300 hover:bg-white hover:border-blue-300 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr ${feature.gradient} text-white shadow-lg shadow-blue-500/10 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={26} />
                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700 border border-blue-100">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}