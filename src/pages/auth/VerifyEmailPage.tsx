import { useState, useEffect, useRef, type FormEvent, type KeyboardEvent, type ClipboardEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  MailCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  RotateCw,
  ShieldCheck,
  ArrowRight,
  Mail,
} from "lucide-react";
import authService from "../../services/authService";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Extract initial query params if present
  const queryToken = searchParams.get("token") || searchParams.get("verificationToken");
  const queryCode = searchParams.get("code");
  const initialEmail = searchParams.get("email") || "";

  // Component state
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [verifyingToken, setVerifyingToken] = useState(Boolean(queryToken));
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // Resend cooldown timer
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  // Countdown redirect timer after success
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  // References for OTP input fields
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 1. Auto-verify URL Token on mount if present in URL
  useEffect(() => {
    if (queryToken) {
      handleAutoVerifyToken(queryToken);
    } else if (queryCode && queryCode.length === 6) {
      const codeDigits = queryCode.split("").slice(0, 6);
      setOtp(codeDigits);
      handleVerifyCode(queryCode);
    }
  }, [queryToken, queryCode]);

  // 2. Cooldown timer ticker
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // 3. Success auto-redirect ticker
  const targetRole = searchParams.get("role") || "customer";
  const loginPath = targetRole === "professional" ? "/professional/login" : targetRole === "company" ? "/company/login" : "/customer/login";

  useEffect(() => {
    if (status !== "success") return;
    if (redirectCountdown <= 0) {
      navigate(loginPath);
      return;
    }
    const timer = setInterval(() => {
      setRedirectCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [status, redirectCountdown, navigate, loginPath]);

  // Auto-verify token from URL parameter
  const handleAutoVerifyToken = async (token: string) => {
    setVerifyingToken(true);
    setStatus("idle");
    setMessage("");

    try {
      const res = await authService.verifyEmail({ token, email: email || undefined });
      if (res.success) {
        setStatus("success");
        setMessage(res.message);
      } else {
        setStatus("error");
        setMessage(res.message || "Failed to verify email.");
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Verification failed or token expired.");
    } finally {
      setVerifyingToken(false);
    }
  };

  // Verify OTP code
  const handleVerifyCode = async (codeToVerify?: string) => {
    const fullCode = codeToVerify || otp.join("");
    if (fullCode.length !== 6) {
      setStatus("error");
      setMessage("Please enter all 6 digits of your verification code.");
      return;
    }

    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const res = await authService.verifyEmail({ code: fullCode, email: email || undefined });
      if (res.success) {
        setStatus("success");
        setMessage(res.message);
      } else {
        setStatus("error");
        setMessage(res.message || "Invalid verification code.");
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Unable to verify email code.");
    } finally {
      setLoading(false);
    }
  };

  // Input change handler for OTP boxes
  const handleOtpChange = (index: number, value: string) => {
    // Only keep last typed character if numeric
    const cleanValue = value.replace(/[^0-9]/g, "");
    if (!cleanValue && value !== "") return;

    const newOtp = [...otp];
    newOtp[index] = cleanValue.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input box
    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all digits are entered
    const isComplete = newOtp.every((digit) => digit !== "");
    if (isComplete) {
      handleVerifyCode(newOtp.join(""));
    }
  };

  // Keydown handler (Backspace navigation)
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste events (e.g. user pastes 6-digit code)
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().replace(/[^0-9]/g, "");
    if (pastedData) {
      const digits = pastedData.slice(0, 6).split("");
      const newOtp = [...otp];
      digits.forEach((digit, idx) => {
        if (idx < 6) newOtp[idx] = digit;
      });
      setOtp(newOtp);

      // Focus appropriate box
      const targetIndex = Math.min(digits.length, 5);
      inputRefs.current[targetIndex]?.focus();

      if (digits.length === 6) {
        handleVerifyCode(digits.join(""));
      }
    }
  };

  // Submit manual form
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleVerifyCode();
  };

  // Resend code handler
  const handleResend = async () => {
    if (resendCooldown > 0 || resendLoading) return;

    if (!email) {
      setResendMessage("Please enter your registered email address first.");
      return;
    }

    setResendLoading(true);
    setResendMessage("");

    try {
      const res = await authService.resendVerificationCode(email);
      setResendMessage(res.message);
      setResendCooldown(60); // 60 seconds timer
    } catch (err: any) {
      setResendMessage(err.message || "Could not resend code. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Ambient Background Blur */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-3xl font-extrabold text-slate-900 tracking-tight">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <ShieldCheck size={24} />
          </div>
          <span>AIBOS</span>
        </Link>
        <p className="mt-2 text-sm text-slate-500 font-medium">Verify your email to activate your account</p>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-200/60 p-8 sm:p-10 relative z-10 backdrop-blur-sm">
        
        {/* State 1: Verifying URL token spinner */}
        {verifyingToken ? (
          <div className="text-center py-8 space-y-4">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Loader2 size={36} className="animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Verifying Email...</h2>
            <p className="text-sm text-slate-500">Please wait while we validate your verification link.</p>
          </div>
        ) : status === "success" ? (
          /* State 2: Success state */
          <div className="text-center py-4 space-y-6">
            <div className="mx-auto h-20 w-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center ring-8 ring-emerald-50/60 transition-transform scale-105">
              <CheckCircle2 size={44} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">Email Verified!</h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {message || "Your email address has been successfully verified. You can now access all AIBOS features."}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 text-xs text-slate-500 flex items-center justify-between">
              <span>Redirecting to login automatically...</span>
              <span className="font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                {redirectCountdown}s
              </span>
            </div>

            <div className="pt-2 space-y-3">
              <button
                onClick={() => navigate(loginPath)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 hover:shadow-blue-600/35 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                Proceed to Sign In ({targetRole.charAt(0).toUpperCase() + targetRole.slice(1)})
                <ArrowRight size={18} />
              </button>

              <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-500 pt-2">
                <span>Other logins:</span>
                <Link to="/customer/login" className="text-blue-600 hover:underline">Customer</Link>
                <Link to="/professional/login" className="text-indigo-600 hover:underline">Professional</Link>
                <Link to="/company/login" className="text-cyan-600 hover:underline">Company</Link>
              </div>
            </div>
          </div>
        ) : (
          /* State 3: Normal Form / OTP Input State */
          <div>
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                <MailCheck size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Enter Verification Code</h2>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                We sent a 6-digit code to{" "}
                <strong className="text-slate-800">{email || "your registered email"}</strong>.
                Enter the code below to complete registration.
              </p>
            </div>

            {/* Global Error Banner */}
            {status === "error" && (
              <div role="alert" className="mb-6 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700 flex items-start gap-3">
                <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-500" />
                <div className="flex-1">
                  <p className="font-semibold">Verification Failed</p>
                  <p className="mt-0.5 text-xs text-red-600 leading-snug">{message}</p>
                </div>
              </div>
            )}

            {/* Email Input Field if no email was present */}
            {!initialEmail && (
              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Target Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                  />
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 6-Digit OTP Box Grid */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3 text-center">
                  6-Digit Security Code
                </label>
                <div className="flex justify-between items-center gap-2 sm:gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={handlePaste}
                      className={`w-11 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-2xl border transition-all duration-200 outline-none ${
                        digit
                          ? "border-blue-600 bg-blue-50/40 text-blue-900 ring-4 ring-blue-500/10"
                          : "border-slate-200 bg-white text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Submit Verification Button */}
              <button
                type="submit"
                disabled={loading || otp.join("").length !== 6}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 hover:shadow-blue-600/35 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Verifying Code...
                  </>
                ) : (
                  <>
                    Verify Email
                    <ShieldCheck size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Resend Code Section */}
            <div className="mt-8 border-t border-slate-100 pt-6 text-center">
              <p className="text-xs text-slate-500">Didn't receive the email code?</p>
              
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || resendLoading}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Sending new code...
                  </>
                ) : resendCooldown > 0 ? (
                  <>
                    <RotateCw size={14} className="animate-spin" />
                    Resend code in {resendCooldown}s
                  </>
                ) : (
                  <>
                    <RotateCw size={14} />
                    Resend verification code
                  </>
                )}
              </button>

              {resendMessage && (
                <p className="mt-2 text-xs font-medium text-slate-600 bg-slate-100 p-2.5 rounded-xl">
                  {resendMessage}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8 border-t border-slate-100 pt-6 text-center">
          <Link
            to="/customer/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft size={14} />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
