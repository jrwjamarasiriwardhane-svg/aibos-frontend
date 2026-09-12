import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface TrustBadgeProps {
  score?: number; // 0 - 100
  identityVerified?: boolean;
  skillsVerified?: boolean;
  reviewsCount?: number;
  variant?: "compact" | "detailed";
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  score = 95,
  identityVerified = true,
  skillsVerified = true,
  reviewsCount = 18,
  variant = "compact",
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getTier = (s: number) => {
    if (s >= 90) return { label: "Elite Verified", color: "emerald", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    if (s >= 75) return { label: "Verified Safe", color: "blue", bg: "bg-blue-50 text-blue-700 border-blue-200" };
    if (s >= 50) return { label: "Standard", color: "amber", bg: "bg-amber-50 text-amber-700 border-amber-200" };
    return { label: "Under Review", color: "rose", bg: "bg-rose-50 text-rose-700 border-rose-200" };
  };

  const tier = getTier(score);

  if (variant === "compact") {
    return (
      <div className="relative inline-block">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition cursor-pointer ${tier.bg}`}
          title="AIBOS Trust Index"
        >
          <ShieldCheck size={13} className="shrink-0" />
          <span>Trust: {score}%</span>
        </button>

        {showDetails && (
          <div className="absolute right-0 top-8 z-50 w-64 bg-white rounded-2xl p-4 shadow-xl border border-slate-200 text-left animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-600" />
                AIBOS Trust Index
              </span>
              <span className="text-xs font-mono font-black text-emerald-600">
                {score}/100
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center justify-between">
                <span>Government ID:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={11} /> {identityVerified ? "Verified" : "Pending"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Skill Assessment:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={11} /> {skillsVerified ? "Certified" : "Pending"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>AI Fraud Screen:</span>
                <span className="font-semibold text-emerald-600">Passed</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Verified Reviews:</span>
                <span className="font-semibold text-slate-800">{reviewsCount} jobs</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 leading-tight">
              AIBOS Verified Trust Profile
            </h4>
            <p className="text-[10px] text-slate-500">Autonomous multi-factor safety check</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-lg font-black text-emerald-700 font-mono">
            {score}/100
          </span>
          <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">
            {tier.label}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
        <div className="p-2 bg-white rounded-xl border border-slate-100 flex items-center gap-2">
          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
          <span className="text-[11px] text-slate-700">Govt ID Verified</span>
        </div>
        <div className="p-2 bg-white rounded-xl border border-slate-100 flex items-center gap-2">
          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
          <span className="text-[11px] text-slate-700">Skills Certified</span>
        </div>
      </div>
    </div>
  );
};

export default TrustBadge;
