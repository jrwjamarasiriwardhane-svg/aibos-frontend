import type { LucideIcon } from "lucide-react";

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder: string;
  icon: LucideIcon;
}

export default function InputField({
  label,
  type = "text",
  placeholder,
  icon: Icon,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 transition-all duration-200 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
        <Icon className="h-5 w-5 text-slate-400" />

        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
        />
      </div>
    </div>
  );
}