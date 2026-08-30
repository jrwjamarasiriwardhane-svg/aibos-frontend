import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Compass } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-16 text-center">
      <div className="relative mb-6">
        <div className="text-8xl font-extrabold tracking-tight text-slate-200 sm:text-9xl">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-2xl bg-blue-600 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/30">
            Page Not Found
          </span>
        </div>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Oops! We couldn't find that page
      </h1>

      <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
        The link you followed may be broken, or the page may have been moved.
      </p>

      {/* Quick Navigation Cards */}
      <div className="mt-8 grid w-full max-w-lg gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <ArrowLeft size={18} />
          </div>
          <span className="mt-2 text-xs font-semibold text-slate-800">Go Back</span>
        </button>

        <Link
          to="/"
          className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Home size={18} />
          </div>
          <span className="mt-2 text-xs font-semibold text-slate-800">Home Page</span>
        </Link>

        <Link
          to="/services/search"
          className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Compass size={18} />
          </div>
          <span className="mt-2 text-xs font-semibold text-slate-800">Find Services</span>
        </Link>
      </div>

      {/* Direct dashboard shortcuts */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
        <span>Quick Access:</span>
        <Link to="/customer/dashboard" className="text-blue-600 hover:underline">
          Customer Dashboard
        </Link>
        <span>•</span>
        <Link to="/professional/dashboard" className="text-blue-600 hover:underline">
          Professional Dashboard
        </Link>
        <span>•</span>
        <Link to="/admin/dashboard" className="text-blue-600 hover:underline">
          Admin Portal
        </Link>
      </div>
    </div>
  );
}
