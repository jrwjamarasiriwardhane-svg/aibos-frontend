import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  LockKeyhole,
  Loader2,
  Mail,
} from "lucide-react";

import professionalLoginImg from "../../assets/images/professionalogin.png";

export default function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle login
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const apiUrl =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api";

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
          navigate(`/verify-email?email=${encodeURIComponent(formData.email)}&role=professional`);
          return;
        }
        throw new Error(
          data.message || "Login failed"
        );
      }

      // Only allow professional accounts
      if (data.user?.role !== "professional") {
        throw new Error(
          "This account is not registered as a professional."
        );
      }

      // Save authentication
      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Redirect
      navigate("/professional/dashboard");

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <div className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:flex-col lg:justify-between">

          {/* Background Image */}
          <img
            src={professionalLoginImg}
            alt="Skilled Professional"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/20" />

          {/* Logo */}
          <div className="relative z-10 p-12">
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-tight text-white transition-opacity hover:opacity-80"
            >
              AIBOS
            </Link>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-xl px-12">

            {/* Icon */}
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
              <BriefcaseBusiness size={28} />
            </div>

            <h1 className="text-5xl font-bold leading-tight text-white">
              Your next project starts here.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Access AI-matched technical projects, manage
              your work, track earnings, and grow your career
              with AIBOS.
            </p>

            {/* Features */}
            <div className="mt-8 space-y-3 text-sm text-slate-200">

              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  ✓
                </span>

                AI-powered job matching
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  ✓
                </span>

                Verified companies and opportunities
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  ✓
                </span>

                Manage your professional career
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 p-12">
            <p className="text-sm text-slate-400">
              AIBOS Skilled Workforce Workspace
            </p>
          </div>

        </div>

        {/* =====================================================
            RIGHT SIDE - LOGIN
        ====================================================== */}

        <div className="flex min-h-screen items-center justify-center px-6 py-12">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <Link
              to="/"
              className="mb-10 block text-center text-2xl font-extrabold tracking-tight text-slate-900 lg:hidden"
            >
              AIBOS
            </Link>

            {/* Heading */}
            <div className="mb-8">

              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Professional Login
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h2>

              <p className="mt-3 text-slate-500">
                Sign in to access your professional workspace.
              </p>

            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
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
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    required
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                  {/* Show / Hide Password */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 focus:outline-none"
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

              {/* Login Button */}
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
              Don't have a professional account?{" "}

              <Link
                to="/professional/register"
                className="font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Create account
              </Link>
            </p>

            {/* Security */}
            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-center text-xs leading-5 text-slate-500">
                Your account is protected by secure authentication.
                Never share your password or login credentials.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}