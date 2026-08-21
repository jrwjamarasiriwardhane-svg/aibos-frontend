import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AccountOverview from "./components/AccountOverview";
import CustomerSidebar from "./components/CustomerSidebar";
import CustomerStats from "./components/CustomerStats";
import CustomerRequestList from "./components/CustomerRequestList";

import { getMyServiceRequests } from "./services/serviceRequestService";
import type { ServiceRequest } from "./types/ServiceRequest";

interface CustomerUser {
  id?: string;
  fullName?: string;
  email?: string;
  role?: string;
  profileImage?: string;
}

export default function CustomerDashboard() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Persistent user state (including profile photo preview)
  const [user, setUser] = useState<CustomerUser>(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });

  const [imgError, setImgError] = useState(false);

  const firstName = user?.fullName?.split(" ")[0] || "Customer";
  const firstLetter = user?.fullName?.charAt(0)?.toUpperCase() || "C";

  // =====================================================
  // PROFILE PHOTO HANDLERS
  // =====================================================

  const handleImageChange = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    const updatedUser = { ...user, profileImage: previewUrl };
    
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setImgError(false);

    // Optional API call to submit photo to server:
    // const formData = new FormData();
    // formData.append("profileImage", file);
    // await uploadProfileImage(token, formData);
  };

  const handleImageDelete = () => {
    const updatedUser = { ...user, profileImage: "" };
    
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setImgError(false);

    // Optional API call to remove photo:
    // await deleteProfileImage(token);
  };

  // =====================================================
  // LOAD SERVICE REQUESTS
  // =====================================================

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Your session has expired. Please login again.");
        return;
      }

      const data = await getMyServiceRequests(token);

      setRequests(data || []);
    } catch (err: any) {
      console.error(
        "CUSTOMER DASHBOARD REQUEST ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to load your service requests."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadRequests();
  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/customer/login");
  };

  // =====================================================
  // STATS
  // =====================================================

  const activeRequests = requests.filter((request) =>
    [
      "pending",
      "matched",
      "accepted",
      "in_progress",
    ].includes(request.status)
  ).length;

  const completedServices = requests.filter(
    (request) => request.status === "completed"
  ).length;

  const totalRequests = requests.length;

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* SIDEBAR */}
      <CustomerSidebar
        activeRequests={activeRequests}
        onLogout={handleLogout}
      />

      {/* MAIN */}
      <main className="min-h-screen lg:ml-64">

        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-5 sm:px-8">

            {/* LEFT */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Customer Workspace
              </p>
              <h1 className="text-lg font-bold text-slate-900">
                AIBOS
              </h1>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">

              {/* Notification Button */}
              <button
                type="button"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600" />
              </button>

              <div className="h-8 w-px bg-slate-200" />

              {/* USER PROFILE IN HEADER */}
              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-bold text-slate-900">
                    {user?.fullName || "Customer"}
                  </p>
                  <p className="text-xs capitalize text-slate-500">
                    {user?.role || "Customer"}
                  </p>
                </div>

                {/* SYNCHRONIZED HEADER AVATAR */}
                {user?.profileImage && !imgError ? (
                  <img
                    src={user.profileImage}
                    alt={user.fullName || "User Avatar"}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-200"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 ring-2 ring-slate-200">
                    {firstLetter}
                  </div>
                )}
              </div>

            </div>

          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="mx-auto max-w-7xl p-5 sm:p-8">

          {/* WELCOME HERO */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 px-7 py-9 text-white shadow-xl sm:px-10 sm:py-11">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -bottom-24 right-40 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                <span className="text-xs font-semibold text-blue-300">
                  CUSTOMER DASHBOARD
                </span>
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Good morning, {firstName} 👋
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Find verified professionals, create service requests, and manage your services from one workspace.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/request-service")}
                  className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:bg-slate-100"
                >
                  + Request a Service
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/professionals")}
                  className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  Find Professionals →
                </button>
              </div>
            </div>
          </section>

          {/* STATISTICS */}
          <CustomerStats
            activeRequests={activeRequests}
            completedServices={completedServices}
            totalRequests={totalRequests}
          />

          {/* QUICK ACTIONS */}
          <section className="mt-8 grid gap-5 md:grid-cols-2">
            <button
              type="button"
              onClick={() => navigate("/request-service")}
              className="group rounded-2xl bg-blue-600 p-6 text-left text-white shadow-lg shadow-blue-600/10 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">Need a Professional?</p>
                  <p className="mt-1 text-sm text-blue-100">Tell AIBOS what service you need.</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl">
                  +
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate("/professionals")}
              className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-900">Find Professionals</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Browse verified professionals by skill, location and rating.
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600 transition group-hover:translate-x-1">
                  →
                </div>
              </div>
            </button>
          </section>

          {/* SERVICE REQUESTS */}
          <CustomerRequestList
            requests={requests}
            loading={loading}
            error={error}
            onRefresh={loadRequests}
            onCreateRequest={() => navigate("/request-service")}
          />

          {/* RECOMMENDED PROFESSIONALS */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    ✦
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Recommended Professionals
                  </h2>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Professionals matched to your service needs will appear here.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/professionals")}
                className="hidden text-sm font-semibold text-blue-600 hover:text-blue-700 sm:block"
              >
                View all →
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl shadow-sm ring-1 ring-slate-100">
                ✦
              </div>
              <h3 className="mt-4 font-bold text-slate-900">AI matching coming next</h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                AIBOS will recommend professionals based on skills, location, experience, availability, ratings and your service requirements.
              </p>
              <button
                type="button"
                onClick={() => navigate("/professionals")}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Browse Professionals
              </button>
            </div>
          </section>

          {/* ACCOUNT OVERVIEW WITH ACTIVE PHOTO HANDLERS */}
          <AccountOverview
            user={user}
            onImageChange={handleImageChange}
            onImageDelete={handleImageDelete}
          />

          {/* FOOTER */}
          <footer className="py-8 text-center">
            <p className="text-xs text-slate-400">
              AIBOS · AI Business Operating System
            </p>
          </footer>

        </div>

      </main>
    </div>
  );
}