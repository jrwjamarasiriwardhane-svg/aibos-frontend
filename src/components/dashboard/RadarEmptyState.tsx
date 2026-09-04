import { Radio, Plus } from "lucide-react";

interface RadarEmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export default function RadarEmptyState({
  title = "No Active Requests in Mesh",
  description = "Your command center is online and ready for new service requests.",
  actionText = "Create New Request",
  onAction,
}: RadarEmptyStateProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60 p-10 text-center backdrop-blur-xl">
      {/* Radar scanning sweep animation */}
      <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-cyan-500/30 bg-slate-900/80 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
        {/* Concentric rings */}
        <div className="absolute inset-2 rounded-full border border-cyan-500/20" />
        <div className="absolute inset-6 rounded-full border border-cyan-500/10" />

        {/* Crosshair lines */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/20 -translate-y-1/2" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-500/20 -translate-x-1/2" />

        {/* Rotating radar sweep beam */}
        <div
          className="absolute inset-0 rounded-full opacity-40 animate-spin"
          style={{
            background: "conic-gradient(from 0deg, rgba(6, 182, 212, 0.4) 0deg, transparent 60deg, transparent 360deg)",
            animationDuration: "4s",
          }}
        />

        {/* Pulsing center ping */}
        <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
          <Radio size={20} className="animate-pulse" />
        </div>
      </div>

      <h4 className="mt-6 text-base font-bold text-white tracking-tight">{title}</h4>
      <p className="mx-auto mt-2 max-w-sm text-xs sm:text-sm text-slate-400 leading-relaxed">
        {description}
      </p>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-600/20 transition hover:from-blue-500 hover:to-cyan-500 active:scale-95 cursor-pointer"
        >
          <Plus size={15} />
          {actionText}
        </button>
      )}
    </div>
  );
}
