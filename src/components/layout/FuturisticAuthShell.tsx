import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface FuturisticAuthShellProps {
  badge: string;
  headline: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
}

export default function FuturisticAuthShell({
  badge,
  headline,
  description,
  icon: Icon,
  children,
}: FuturisticAuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060913] text-slate-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #22d3ee 1px, transparent 1px), linear-gradient(to bottom, #22d3ee 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-600/25 blur-3xl" />

      <div className="relative grid min-h-screen lg:grid-cols-2">
        <div className="hidden flex-col justify-between p-12 lg:flex">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-white">
            AIBOS
          </Link>

          <div className="max-w-lg">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.25)]">
              <Icon size={28} />
            </div>
            <p className="text-xs font-mono font-bold uppercase tracking-[0.22em] text-cyan-300">
              {badge}
            </p>
            <h1 className="mt-3 text-5xl font-bold leading-tight text-white">{headline}</h1>
            <p className="mt-6 text-lg leading-8 text-slate-400">{description}</p>
          </div>

          <p className="font-mono text-xs tracking-widest text-slate-500">
            AI-POWERED WORKFORCE NETWORK
          </p>
        </div>

        <div className="flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
          <div className="w-full max-w-md rounded-3xl border border-cyan-400/20 bg-slate-950/75 p-6 shadow-[0_0_60px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:p-10">
            <div className="mb-6 flex justify-center lg:hidden">
              <Link to="/" className="text-2xl font-extrabold tracking-tight text-white hover:text-cyan-300 transition-colors">
                AIBOS
              </Link>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
