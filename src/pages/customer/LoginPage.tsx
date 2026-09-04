import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Loader2,
  Mail,
  UserRound,
  Search,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
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
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.requiresEmailVerification) {
          navigate(`/verify-email?email=${encodeURIComponent(formData.email)}&role=customer`);
          return;
        }
        throw new Error(data.message || "Login failed");
      }

      // Make sure this account is a customer
      if (data.user?.role !== "customer") {
        throw new Error(
          "This account is not registered as a customer."
        );
      }

      // Store authentication data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Go to customer dashboard
      navigate("/customer/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =====================================================
            LEFT BRANDING
        ====================================================== */}
        <div className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">

          {/* Background decoration */}
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />

          {/* Logo */}
          <div className="relative z-10">
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-tight"
            >
              AIBOS
            </Link>
          </div>

          {/* Main content */}
          <div className="relative z-10 max-w-lg">

            {/* Icon */}
            <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
              <Search size={30} />
            </div>

            <h1 className="text-5xl font-bold leading-tight">
              Find the right professional for your needs.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              Discover trusted professionals, request services,
              compare options, and manage your bookings from one
              intelligent platform.
            </p>

            {/* Benefits */}
            <div className="mt-10 space-y-4">

              <div className="flex items-center gap-3 text-slate-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck size={18} />
                </div>

                <span className="text-sm">
                  Verified professionals
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  <Search size={18} />
                </div>

                <span className="text-sm">
                  AI-powered professional matching
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                  <UserRound size={18} />
                </div>

                <span className="text-sm">
                  Secure customer workspace
                </span>
              </div>

            </div>
          </div>

          {/* Footer */}
          <p className="relative z-10 text-sm text-slate-500">
            AIBOS Customer Workspace
          </p>
        </div>

        {/* =====================================================
            RIGHT LOGIN FORM
        ====================================================== */}
        <div className="flex items-center justify-center px-6 py-12">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <Link
              to="/"
              className="mb-10 block text-center text-2xl font-extrabold text-slate-900 lg:hidden"
            >
              AIBOS
            </Link>

            {/* Heading */}
            <div className="mb-8">

              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                CUSTOMER LOGIN
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Welcome back
              </h2>

              <p className="mt-3 text-slate-500">
                Sign in to find professionals and manage your
                service requests.
              </p>

            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 space-y-2"
              >
                <p>{error}</p>
                {error.toLowerCase().includes("verify") && (
                  <Link
                    to={`/verify-email?email=${encodeURIComponent(formData.email)}&role=customer`}
                    className="inline-block font-semibold text-blue-600 hover:text-blue-700 underline text-xs"
                  >
                    Click here to enter verification code or resend email →
                  </Link>
                )}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
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
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>
              </div>

              {/* Password */}
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
                    className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
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
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

            </form>

            {/* Register */}
            <p className="mt-7 text-center text-sm text-slate-500">
              Don't have a customer account?{" "}
              <Link
                to="/customer/register"
                className="font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Create account
              </Link>
            </p>

            {/* Security message */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={15} />
              Your account is protected by secure authentication.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}