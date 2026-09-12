import React, { useState } from "react";
import {
  Sparkles,
  Loader2,
  Wrench,
  Clock,
  DollarSign,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
} from "lucide-react";

interface StructuredJobResult {
  title?: string;
  category: string;
  description: string;
  urgency: "normal" | "urgent" | "emergency";
  estimatedBudget?: number;
  suggestedQuestions?: string[];
  tags?: string[];
}

interface AIJobDescriptionGeneratorProps {
  onApply: (data: {
    category: string;
    description: string;
    urgency: "normal" | "urgent" | "emergency";
    budget?: number;
  }) => void;
  initialCategory?: string;
}

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";

export const AIJobDescriptionGenerator: React.FC<AIJobDescriptionGeneratorProps> = ({
  onApply,
  initialCategory = "",
}) => {
  const [naturalText, setNaturalText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StructuredJobResult | null>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!naturalText.trim()) {
      setError("Please describe what you need in plain words.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/ai/generate-description`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          naturalText,
          category: initialCategory || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate description");
      }

      const data = await res.json();
      if (data.success && data.structured) {
        setResult(data.structured);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.warn("AI generation error, using smart client-side heuristics:", err);
      // Smart client-side heuristic fallback
      const lower = naturalText.toLowerCase();
      let cat = "Other";
      if (lower.includes("ac") || lower.includes("air") || lower.includes("cool")) cat = "AC Repair";
      else if (lower.includes("wire") || lower.includes("light") || lower.includes("electric") || lower.includes("power")) cat = "Electrician";
      else if (lower.includes("pipe") || lower.includes("water") || lower.includes("leak") || lower.includes("plumb")) cat = "Plumber";
      else if (lower.includes("wood") || lower.includes("door") || lower.includes("carpent")) cat = "Carpenter";
      else if (lower.includes("paint")) cat = "Painter";
      else if (lower.includes("clean")) cat = "Cleaning";
      else if (lower.includes("car") || lower.includes("mechanic")) cat = "Mechanic";

      const isUrgent =
        lower.includes("urgent") ||
        lower.includes("emergency") ||
        lower.includes("asap") ||
        lower.includes("today") ||
        lower.includes("now");

      setResult({
        category: cat,
        description: `Client Issue: ${naturalText.trim()}\n\nScope of Work:\n- Initial inspection and fault diagnosis\n- Required repair or part replacement\n- Operational testing and sign-off`,
        urgency: isUrgent ? "urgent" : "normal",
        estimatedBudget: 3500,
        tags: [cat, isUrgent ? "Priority" : "Standard"],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToForm = () => {
    if (!result) return;
    onApply({
      category: result.category,
      description: result.description,
      urgency: result.urgency,
      budget: result.estimatedBudget,
    });
  };

  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              AI Job Description Assistant
            </h3>
            <p className="text-xs text-slate-500">
              Describe in your own words — AIBOS parses category, urgency & scope
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md uppercase tracking-wider">
          AI NLP
        </span>
      </div>

      {/* Input area */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            rows={3}
            value={naturalText}
            onChange={(e) => setNaturalText(e.target.value)}
            placeholder="e.g. My inverter is beeping constantly and cutting out power to the living room, need a qualified electrician to inspect today..."
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-y min-h-[75px]"
          />
        </div>

        {error && (
          <p className="text-xs text-rose-600 font-medium">{error}</p>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Lightbulb size={13} className="text-amber-500" />
            <span className="hidden xs:inline">Tip: Mention urgency and problem symptoms</span>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !naturalText.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Analyzing Scope...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>Structure with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Result Preview */}
      {result && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/60 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                <Wrench size={12} />
                {result.category}
              </span>

              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                  result.urgency === "urgent" || result.urgency === "emergency"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                <Clock size={11} />
                {result.urgency.toUpperCase()}
              </span>

              {result.estimatedBudget && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-100 text-blue-700 text-[11px] font-semibold">
                  <DollarSign size={11} />
                  Est. LKR {result.estimatedBudget.toLocaleString()}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleApplyToForm}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow hover:bg-emerald-700 transition cursor-pointer"
            >
              <CheckCircle2 size={13} />
              <span>Apply to Form</span>
            </button>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Structured Description
            </p>
            <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans bg-white/70 p-2.5 rounded-lg border border-slate-200">
              {result.description}
            </p>
          </div>

          {result.suggestedQuestions && result.suggestedQuestions.length > 0 && (
            <div className="pt-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                <HelpCircle size={11} />
                Professional Might Ask
              </p>
              <ul className="text-xs text-slate-600 list-disc list-inside space-y-0.5">
                {result.suggestedQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIJobDescriptionGenerator;
