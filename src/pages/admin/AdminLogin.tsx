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

export default function AdminLogin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const apiUrl =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api";

      const response = await fetch(
        `${apiUrl}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      // -----------------------------------------
      // Get user from backend response
      // -----------------------------------------

      const loggedUser =
        data.user || data.userData || data.data;

      // -----------------------------------------
      // Check admin role
      // -----------------------------------------

      if (!loggedUser) {
        throw new Error(
          "User information was not returned by the server."
        );
      }

      if (loggedUser.role !== "admin") {
        throw new Error(
          "Access denied. This account is not an admin account."
        );
      }

      // -----------------------------------------
      // Save authentication
      // -----------------------------------------

      if (!data.token) {
        throw new Error(
          "Login token was not returned by the server."
        );
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(loggedUser)
      );

      // -----------------------------------------
      // Go to admin dashboard
      // -----------------------------------------

      navigate("/admin/dashboard");

    } catch (err) {
      console.error("ADMIN LOGIN ERROR:", err);

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

        {/* =====================================
            LEFT SIDE
        ====================================== */}

        <div className="hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">

          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight"
          >
            AIBOS
          </Link>

          <div className="max-w-lg">

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
              <ShieldCheck size={28} />
            </div>

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Administration Portal
            </p>

            <h1 className="mt-3 text-5xl font-bold leading-tight">
              Manage the AIBOS workforce ecosystem.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              Verify professionals, manage companies,
              review users and keep the AIBOS
              marketplace trusted and secure.
            </p>

          </div>

          <p className="text-sm text-slate-500">
            AI-powered workforce platform
          </p>

        </div>

        {/* =====================================
            RIGHT SIDE
        ====================================== */}

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

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <ShieldCheck size={24} />
              </div>

              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Admin Login
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Welcome back
              </h2>

              <p className="mt-3 text-slate-500">
                Sign in to access the AIBOS
                administration portal.
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

              {/* EMAIL */}

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
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="admin@aibos.com"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

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
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-12 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
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

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
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
                    Sign in to Admin Portal
                    <ArrowRight size={18} />
                  </>
                )}

              </button>

            </form>

            {/* Security note */}

            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4">

              <div className="flex items-start gap-3">

                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <p className="text-xs leading-5 text-slate-500">
                  This portal is restricted to
                  authorized AIBOS administrators.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}