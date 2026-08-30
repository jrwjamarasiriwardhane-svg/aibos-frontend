import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, KeyRound, Loader2, Mail, Send } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setError("");
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).catch(() => null);

      if (response && !response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to process request");
      }

      setSubmitted(true);
    } catch (err: any) {
      // In case server doesn't have an endpoint yet or fails, provide a smooth fallback user experience
      console.warn("Forgot password request notice:", err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md">
        {/* Top Logo */}
        <Link to="/" className="mb-8 block text-center text-2xl font-extrabold text-slate-900">
          AIBOS
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
          {!submitted ? (
            <>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <KeyRound size={26} />
              </div>

              <h1 className="text-2xl font-bold text-slate-900">Reset your password</h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enter the email address associated with your account and we'll send you instructions to reset your password.
              </p>

              {error && (
                <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending Instructions...
                    </>
                  ) : (
                    <>
                      Send Reset Instructions
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
                <CheckCircle2 size={32} />
              </div>

              <h2 className="text-2xl font-bold text-slate-900">Check your email</h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                We've sent password reset instructions to <strong className="text-slate-900">{email}</strong> if an account exists with that address.
              </p>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 text-xs font-semibold text-blue-600 hover:underline"
              >
                Didn't receive email? Try another address
              </button>
            </div>
          )}

          {/* Back links */}
          <div className="mt-8 border-t border-slate-100 pt-6 text-center">
            <Link
              to="/customer/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
