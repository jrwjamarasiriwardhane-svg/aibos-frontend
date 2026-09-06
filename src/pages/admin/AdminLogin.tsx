import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Loader2,
  ArrowRight,
} from "lucide-react";
import FuturisticAuthShell from "../../components/layout/FuturisticAuthShell";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      const verifyPath = `/admin/verify-email?email=${encodeURIComponent(formData.email)}&role=admin`;

      // #region agent log
      fetch("http://127.0.0.1:7468/ingest/40b9b3d1-81e1-44a0-9a4c-9da7cea37d4d", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "c1632a" },
        body: JSON.stringify({
          sessionId: "c1632a",
          runId: "post-fix",
          hypothesisId: "A",
          location: "AdminLogin.tsx:handleSubmit",
          message: "admin login response",
          data: {
            ok: response.ok,
            status: response.status,
            requiresEmailVerification: Boolean(data.requiresEmailVerification),
            willRedirectToVerify: Boolean(!response.ok && data.requiresEmailVerification),
            verifyPath,
            role: data.user?.role || null,
            hasToken: Boolean(data.token),
            message: data.message,
            pathname: window.location.pathname,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion

      if (!response.ok) {
        if (data.requiresEmailVerification) {
          navigate(verifyPath);
          return;
        }
        throw new Error(data.message || "Login failed");
      }

      const loggedUser = data.user || data.userData || data.data;

      if (!loggedUser) {
        throw new Error("User information was not returned by the server.");
      }

      if (loggedUser.role !== "admin") {
        throw new Error("Access denied. This account is not an admin account.");
      }

      if (!data.token) {
        throw new Error("Login token was not returned by the server.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(loggedUser));

      navigate("/admin/dashboard");
    } catch (err) {
      console.error("ADMIN LOGIN ERROR:", err);

      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FuturisticAuthShell
      badge="Administration Portal"
      headline="Command the AIBOS workforce network."
      description="Verify professionals, manage companies, and keep the marketplace trusted from a secure admin console."
      icon={ShieldCheck}
    >
      <Link to="/" className="mb-8 block text-center text-2xl font-extrabold text-white lg:hidden">
        AIBOS
      </Link>

      <div className="mb-8">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-300">
          <ShieldCheck size={24} />
        </div>
        <p className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Admin Login
        </p>
        <h2 className="mt-2 text-3xl font-bold text-white">Welcome back</h2>
        <p className="mt-3 text-slate-400">Sign in to access the AIBOS administration portal.</p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 space-y-2 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200"
        >
          <p>{error}</p>
          {(error.toLowerCase().includes("verify") || error.toLowerCase().includes("email")) && (
            <Link
              to={`/admin/verify-email?email=${encodeURIComponent(formData.email)}&role=admin`}
              className="inline-block text-xs font-semibold text-cyan-300 underline hover:text-cyan-200"
            >
              Enter verification code or resend email →
            </Link>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
            Email address
          </label>
          <div className="relative">
            <Mail
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              placeholder="admin@aibos.com"
              className="w-full rounded-xl border border-cyan-400/20 bg-slate-900/80 py-3 pl-10 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">
            Password
          </label>
          <div className="relative">
            <LockKeyhole
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              placeholder="Enter your password"
              className="w-full rounded-xl border border-cyan-400/20 bg-slate-900/80 py-3 pl-10 pr-12 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-cyan-300"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.35)] transition hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in to Admin Portal
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        Need to enter a code?{" "}
        <Link
          to={`/admin/verify-email?email=${encodeURIComponent(formData.email)}&role=admin`}
          className="font-semibold text-cyan-300 hover:text-cyan-200"
        >
          Open verification page
        </Link>
      </p>

      <div className="mt-6 rounded-xl border border-cyan-400/15 bg-slate-900/50 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-emerald-400" />
          <p className="text-xs leading-5 text-slate-400">
            This portal is restricted to authorized AIBOS administrators.
          </p>
        </div>
      </div>
    </FuturisticAuthShell>
  );
}
