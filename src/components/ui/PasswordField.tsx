import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordFieldProps {
  label: string;
  placeholder: string;
}

export default function PasswordField({
  label,
  placeholder,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="flex items-center rounded-xl border border-slate-300 bg-white px-4 py-3 transition-all duration-200 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
        <Lock className="mr-3 h-5 w-5 text-slate-400" />

        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
        >
          {show ? (
            <EyeOff className="h-5 w-5 text-slate-500" />
          ) : (
            <Eye className="h-5 w-5 text-slate-500" />
          )}
        </button>
      </div>
    </div>
  );
}