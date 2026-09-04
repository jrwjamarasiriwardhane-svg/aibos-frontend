import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";

interface HudStatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: "cyan" | "emerald" | "blue" | "amber" | "violet";
  suffix?: string;
  subtext?: string;
}

function useCountUp(target: number, duration = 800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }
    let start = 0;
    const step = Math.ceil(target / (duration / 16)) || 1;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

export default function HudStatCard({
  label,
  value,
  icon: Icon,
  color,
  suffix = "",
  subtext,
}: HudStatCardProps) {
  const animated = useCountUp(value);

  const colorStyles = {
    cyan: {
      border: "border-cyan-500/30 hover:border-cyan-400/60",
      glow: "hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]",
      badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      accentBar: "bg-gradient-to-r from-cyan-500 to-blue-500",
      iconBg: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    },
    emerald: {
      border: "border-emerald-500/30 hover:border-emerald-400/60",
      glow: "hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]",
      badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      accentBar: "bg-gradient-to-r from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    },
    blue: {
      border: "border-blue-500/30 hover:border-blue-400/60",
      glow: "hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]",
      badge: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      accentBar: "bg-gradient-to-r from-blue-500 to-indigo-500",
      iconBg: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    },
    amber: {
      border: "border-amber-500/30 hover:border-amber-400/60",
      glow: "hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]",
      badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      accentBar: "bg-gradient-to-r from-amber-500 to-orange-500",
      iconBg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    },
    violet: {
      border: "border-violet-500/30 hover:border-violet-400/60",
      glow: "hover:shadow-[0_0_25px_rgba(139,92,246,0.2)]",
      badge: "bg-violet-500/10 text-violet-400 border-violet-500/30",
      accentBar: "bg-gradient-to-r from-violet-500 to-purple-500",
      iconBg: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    },
  }[color];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-slate-900/90 p-5 text-white backdrop-blur-xl transition-all duration-300 ${colorStyles.border} ${colorStyles.glow}`}
    >
      {/* Top Cyber Accent Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${colorStyles.accentBar}`} />

      {/* HUD Corner Tech Lines */}
      <div className="absolute top-2 right-2 flex items-center gap-1">
        <span className="h-1 w-1 rounded-full bg-slate-700" />
        <span className="h-1 w-1 rounded-full bg-slate-700" />
        <span className="h-1 w-1 rounded-full bg-slate-700" />
      </div>

      <div className="flex items-start justify-between mt-1">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {label}
          </p>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="font-mono text-3xl sm:text-4xl font-black tabular-nums tracking-tight text-white">
              {animated}
            </span>
            {suffix && (
              <span className="text-lg font-bold text-slate-400">{suffix}</span>
            )}
          </div>
          {subtext && (
            <p className="mt-1.5 text-xs text-slate-400 font-medium">{subtext}</p>
          )}
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl border ${colorStyles.iconBg}`}
        >
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
