import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  Clock3,
  Building2,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Loader2,
  CheckCircle2,
  XCircle,
  BriefcaseBusiness,
  BarChart3,
} from "lucide-react";
import AdminAnalyticsSection from "./AdminAnalyticsSection";

interface Professional {
  _id: string;
  bio?: string;
  skills: string[];
  experienceYears: number;
  location?: string;
  hourlyRate?: number;
  verificationStatus: string;
  identityVerified: boolean;
  skillsVerified: boolean;
  rating: number;
  totalJobs: number;
  completedJobs: number;
  createdAt: string;

  user: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    profileImage?: string;
  };
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [professionals, setProfessionals] = useState<
    Professional[]
  >([]);

  const [overviewCounts, setOverviewCounts] = useState<{
    totalUsers: number;
    professionals: number;
    companies: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentTab, setCurrentTab] = useState<"verification" | "analytics">(
    "verification"
  );

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const token = localStorage.getItem("token");

  // ======================================================
  // FETCH PENDING PROFESSIONALS & PLATFORM STATS
  // ======================================================

  const fetchPendingProfessionals = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const apiUrl =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api";

      const response = await fetch(
        `${apiUrl}/admin/professionals/pending`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load professionals"
        );
      }

      setProfessionals(data.professionals || []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchOverviewCounts = async () => {
    try {
      if (!token) return;
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/analytics/admin/overview`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const json = await response.json();
        const overview = json.data?.overview || json.analytics?.overview || json.data?.users;
        if (overview) {
          setOverviewCounts({
            totalUsers: overview.totalUsers ?? overview.total ?? 0,
            professionals: overview.professionals ?? 0,
            companies: overview.companies ?? 0,
          });
        }
      }
    } catch (e) {
      console.warn("Failed to fetch overview counts:", e);
    }
  };

  useEffect(() => {
    fetchPendingProfessionals();
    fetchOverviewCounts();
  }, []);

  // ======================================================
  // VERIFY PROFESSIONAL
  // ======================================================

  const handleVerify = async (
    professionalId: string
  ) => {
    try {
      const apiUrl =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api";

      const response = await fetch(
        `${apiUrl}/admin/professionals/${professionalId}/verify`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Verification failed"
        );
      }

      setProfessionals((prev) =>
        prev.filter(
          (professional) =>
            professional._id !== professionalId
        )
      );
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Verification failed"
      );
    }
  };

  // ======================================================
  // REJECT PROFESSIONAL
  // ======================================================

  const handleReject = async (
    professionalId: string
  ) => {
    const reason = window.prompt(
      "Enter rejection reason:"
    );

    if (!reason) {
      return;
    }

    try {
      const apiUrl =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api";

      const response = await fetch(
        `${apiUrl}/admin/professionals/${professionalId}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rejectionReason: reason,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Rejection failed"
        );
      }

      setProfessionals((prev) =>
        prev.filter(
          (professional) =>
            professional._id !== professionalId
        )
      );
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Rejection failed"
      );
    }
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#060913]">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="sticky top-0 z-30 border-b border-cyan-400/15 bg-[#060913]/90 backdrop-blur-xl">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

          {/* BRAND */}

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
              <ShieldCheck size={21} />
            </div>

            <div>
              <h1 className="font-bold text-white text-sm sm:text-base">
                AIBOS Admin
              </h1>

              <p className="text-[11px] sm:text-xs text-slate-400">
                Administration Portal
              </p>
            </div>

          </div>

          {/* USER */}

          <div className="flex items-center gap-3 sm:gap-4">

            <div className="hidden text-right sm:block">

              <p className="text-sm font-semibold text-white">
                {user.fullName || "Admin"}
              </p>

              <p className="text-xs capitalize text-slate-500">
                {user.role || "admin"}
              </p>

            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-cyan-400/20 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-200 transition hover:bg-cyan-500/10 cursor-pointer"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>

          </div>

        </div>

      </header>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-400 font-mono">
              ADMINISTRATION COMMAND
            </p>

            <h2 className="mt-1 text-3xl font-bold text-white">
              Dashboard
            </h2>

            <p className="mt-1 text-slate-400 text-sm">
              Manage professionals, platform analytics, and dispatch verification across AIBOS.
            </p>
          </div>

          {/* TAB SWITCHER */}
          <div className="flex items-center gap-2 rounded-2xl bg-slate-900/90 border border-slate-800 p-1.5 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setCurrentTab("verification")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                currentTab === "verification"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <UserCheck size={14} />
              <span>Verifications ({professionals.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab("analytics")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                currentTab === "analytics"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BarChart3 size={14} />
              <span>Platform Analytics</span>
            </button>
          </div>
        </div>

        {currentTab === "analytics" ? (
          <div className="mt-8">
            <AdminAnalyticsSection />
          </div>
        ) : (
          <>
        {/* ==================================================
            STATS
        ================================================== */}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Total Users
              </span>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Users size={20} />
              </div>

            </div>

            <p className="mt-4 text-3xl font-bold text-slate-900">
              {overviewCounts !== null ? overviewCounts.totalUsers.toLocaleString() : "..."}
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Professionals
              </span>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <UserCheck size={20} />
              </div>

            </div>

            <p className="mt-4 text-3xl font-bold text-slate-900">
              {overviewCounts !== null ? overviewCounts.professionals.toLocaleString() : "..."}
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Pending Reviews
              </span>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Clock3 size={20} />
              </div>

            </div>

            <p className="mt-4 text-3xl font-bold text-slate-900">
              {professionals.length}
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <span className="text-sm font-medium text-slate-500">
                Companies
              </span>

              <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                <Building2 size={20} />
              </div>

            </div>

            <p className="mt-4 text-3xl font-bold text-slate-900">
              {overviewCounts !== null ? overviewCounts.companies.toLocaleString() : "..."}
            </p>

          </div>

        </div>

        {/* ==================================================
            PENDING PROFESSIONALS
        ================================================== */}

        <section className="mt-10">

          <div className="flex items-center justify-between">

            <div>

              <h3 className="text-xl font-bold text-slate-900">
                Pending Professional Verification
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Review professionals before they appear
                in customer searches.
              </p>

            </div>

            <button
              onClick={fetchPendingProfessionals}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Refresh
            </button>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* LOADING */}

          {loading && (
            <div className="flex justify-center py-20">

              <Loader2
                size={35}
                className="animate-spin text-blue-600"
              />

            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            professionals.length === 0 && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center">

                <CheckCircle2
                  size={42}
                  className="mx-auto text-emerald-500"
                />

                <h4 className="mt-4 text-lg font-semibold text-slate-900">
                  All caught up
                </h4>

                <p className="mt-2 text-sm text-slate-500">
                  There are no professionals waiting
                  for verification.
                </p>

              </div>
            )}

          {/* PROFESSIONAL LIST */}

          {!loading &&
            professionals.length > 0 && (

              <div className="mt-6 space-y-4">

                {professionals.map(
                  (professional) => (

                    <div
                      key={professional._id}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >

                      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                        {/* PROFILE */}

                        <div className="flex items-start gap-4">

                          {professional.user
                            ?.profileImage ? (

                            <img
                              src={
                                professional.user
                                  .profileImage
                              }
                              alt={
                                professional.user
                                  .fullName
                              }
                              className="h-16 w-16 rounded-full object-cover"
                            />

                          ) : (

                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">

                              {professional.user?.fullName
                                ?.charAt(0)
                                .toUpperCase()}

                            </div>

                          )}

                          <div>

                            <div className="flex items-center gap-2">

                              <h4 className="text-lg font-bold text-slate-900">
                                {
                                  professional.user
                                    ?.fullName
                                }
                              </h4>

                              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                Pending
                              </span>

                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                              {
                                professional.user
                                  ?.email
                              }
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {
                                professional.user
                                  ?.phone
                              }
                            </p>

                          </div>

                        </div>

                        {/* DETAILS */}

                        <div className="grid gap-4 sm:grid-cols-3 flex-1">

                          <div>

                            <p className="text-xs uppercase tracking-wide text-slate-400">
                              Skills
                            </p>

                            <div className="mt-2 flex flex-wrap gap-1">

                              {professional.skills
                                .slice(0, 3)
                                .map((skill) => (

                                  <span
                                    key={skill}
                                    className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
                                  >
                                    {skill}
                                  </span>

                                ))}

                            </div>

                          </div>

                          <div>

                            <p className="text-xs uppercase tracking-wide text-slate-400">
                              Experience
                            </p>

                            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                              <BriefcaseBusiness
                                size={15}
                              />
                              {
                                professional.experienceYears
                              }{" "}
                              years
                            </div>

                          </div>

                          <div>

                            <p className="text-xs uppercase tracking-wide text-slate-400">
                              Location
                            </p>

                            <p className="mt-2 text-sm font-semibold text-slate-700">
                              {professional.location ||
                                "Not provided"}
                            </p>

                          </div>

                        </div>

                        {/* ACTIONS */}

                        <div className="flex shrink-0 gap-3">

                          <button
                            onClick={() =>
                              handleReject(
                                professional._id
                              )
                            }
                            className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            <XCircle size={17} />
                            Reject
                          </button>

                          <button
                            onClick={() =>
                              handleVerify(
                                professional._id
                              )
                            }
                            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                          >
                            <CheckCircle2
                              size={17}
                            />
                            Verify
                          </button>

                          <button
                            onClick={() =>
                              console.log(
                                "View professional",
                                professional._id
                              )
                            }
                            className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-slate-500 hover:bg-slate-50"
                          >
                            <ChevronRight size={18} />
                          </button>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

        </section>
        </>
      )}

      </main>
    </div>
  );
}