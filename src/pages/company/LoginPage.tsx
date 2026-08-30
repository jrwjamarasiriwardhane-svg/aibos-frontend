import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  Loader2,
  Mail,
  ShieldCheck,
  Briefcase,
} from "lucide-react";

export default function CompanyLoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Company login failed");
      }

      if (data.user?.role !== "company" && data.user?.role !== "admin") {
        throw new Error("This account is not registered as a company.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/company/dashboard");
    } catch (err: any) {
      setError(
        err instanceof Error ? err.message : "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT BRANDING */}
        <div className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />

          <div className="relative z-10">
            <Link to="/" className="text-2xl font-extrabold tracking-tight">
              AIBOS
            </Link>
          </div>

          <div className="relative z-10 max-w-lg">
            <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
              <Building2 size={30} />
            </div>

            <h1 className="text-5xl font-bold leading-tight">
              Scale your business with on-demand talent.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              Manage workforce demands, hire verified professionals, automate dispatching, and streamline operations.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  <Briefcase size={18} />
                </div>
                <span className="text-sm">Verified professional teams</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck size={18} />
                </div>
                <span className="text-sm">Enterprise SLA & support</span>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-sm text-slate-500">
            AIBOS Enterprise & Company Portal
          </p>
        </div>

        {/* RIGHT FORM */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="mb-10 block text-center text-2xl font-extrabold text-slate-900 lg:hidden"
            >
              AIBOS
            </Link>

            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                COMPANY LOGIN
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Partner Workspace
              </h2>
              <p className="mt-3 text-slate-500">
                Sign in to manage your company dispatch and staff.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Work Email
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="company@domain.com"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In to Company
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              Want to register your company?{" "}
              <Link
                to="/company/register"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Create company account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}