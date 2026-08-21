import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Bell,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Clock3,
  DollarSign,
  Menu,
  Search,
  Settings,
  Star,
  User,
  X,
  MapPin,
  RefreshCw,
} from "lucide-react";

// ======================================================
// TYPES
// ======================================================

interface ServiceRequest {
  _id: string;

  category: string;

  description: string;

  location: string;

  preferredDate?: string;

  preferredTime?: string;

  budget?: number;

  status:
    | "pending"
    | "matched"
    | "accepted"
    | "in_progress"
    | "completed"
    | "cancelled";

  createdAt?: string;

  customer?: {
    _id?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    profileImage?: string;
  };
}

// ======================================================
// PROFESSIONAL DASHBOARD
// ======================================================

export default function ProfessionalDashboard() {
  const navigate = useNavigate();

  // ====================================================
  // SIDEBAR
  // ====================================================

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // ====================================================
  // SERVICE REQUESTS
  // ====================================================

  const [serviceRequests, setServiceRequests] =
    useState<ServiceRequest[]>([]);

  const [requestsLoading, setRequestsLoading] =
    useState(true);

  const [requestsError, setRequestsError] =
    useState("");

  const [acceptingId, setAcceptingId] =
    useState<string | null>(null);

  const [rejectingId, setRejectingId] =
    useState<string | null>(null);

  // ====================================================
  // USER
  // ====================================================

  const storedUser =
    localStorage.getItem("user");

  let user: {
    fullName?: string;
    email?: string;
    role?: string;
  } = {};

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : {};
  } catch {
    user = {};
  }

  const userName =
    user.fullName || "Professional";

  const firstName =
    userName.split(" ")[0];

  // ====================================================
  // LOGOUT
  // ====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/professional/login");
  };

  // ====================================================
  // GET AVAILABLE SERVICE REQUESTS
  // ====================================================

  const fetchServiceRequests = async () => {
    try {
      setRequestsLoading(true);
      setRequestsError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        setRequestsError(
          "Authentication required. Please login again."
        );

        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/service-requests/available",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },
        }
      );

      const data =
        await response.json();

      console.log(
        "AVAILABLE SERVICE REQUESTS:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load service requests"
        );
      }

      setServiceRequests(
        data.requests || []
      );
    } catch (error) {
      console.error(
        "FETCH SERVICE REQUESTS ERROR:",
        error
      );

      setRequestsError(
        error instanceof Error
          ? error.message
          : "Failed to load service requests"
      );
    } finally {
      setRequestsLoading(false);
    }
  };

  // ====================================================
  // LOAD REQUESTS
  // ====================================================

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  // ====================================================
  // ACCEPT SERVICE REQUEST
  // ====================================================

  const handleAcceptRequest = async (
    requestId: string
  ) => {
    try {
      setAcceptingId(requestId);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");

        navigate(
          "/professional/login"
        );

        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/service-requests/${requestId}/accept`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },
        }
      );

      const data =
        await response.json();

      console.log(
        "ACCEPT REQUEST RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to accept service request"
        );
      }

      // Remove accepted request
      // from available requests
      setServiceRequests(
        (previous) =>
          previous.filter(
            (request) =>
              request._id !== requestId
          )
      );

      alert(
        "Service request accepted successfully!"
      );
    } catch (error) {
      console.error(
        "ACCEPT REQUEST ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to accept request"
      );
    } finally {
      setAcceptingId(null);
    }
  };

  // ====================================================
  // SKIP SERVICE REQUEST
  // ====================================================

  const handleRejectRequest = async (
    requestId: string
  ) => {
    try {
      setRejectingId(requestId);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");

        navigate(
          "/professional/login"
        );

        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/service-requests/${requestId}/reject`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },
        }
      );

      const data =
        await response.json();

      console.log(
        "SKIP REQUEST RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to skip request"
        );
      }

      /*
       * IMPORTANT:
       *
       * We are NOT changing the request
       * in MongoDB.
       *
       * It remains:
       *
       * status = pending
       * assignedProfessional = null
       *
       * So other professionals can
       * still see this request.
       *
       * We only remove it from this
       * professional's current screen.
       */

      setServiceRequests(
        (previous) =>
          previous.filter(
            (request) =>
              request._id !== requestId
          )
      );
    } catch (error) {
      console.error(
        "SKIP REQUEST ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to skip request"
      );
    } finally {
      setRejectingId(null);
    }
  };

  // ====================================================
  // FORMAT DATE
  // ====================================================

  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "Flexible";
    }

    return new Date(
      date
    ).toLocaleDateString();
  };

  // ====================================================
  // MAIN UI
  // ====================================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* ==================================================
          MOBILE OVERLAY
      ================================================== */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* LOGO */}

        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">

          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight text-slate-900"
          >
            AIBOS
          </Link>

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 space-y-1 px-4 py-6">

          <SidebarItem
            icon={
              <Briefcase size={19} />
            }
            label="Dashboard"
            to="/professional/dashboard"
            active
          />

          <SidebarItem
            icon={
              <Search size={19} />
            }
            label="Find Jobs"
            to="/professional/jobs"
          />

          <SidebarItem
            icon={
              <Clock3 size={19} />
            }
            label="Applications"
            to="/professional/applications"
          />

          <SidebarItem
            icon={
              <CheckCircle2 size={19} />
            }
            label="My Work"
            to="/professional/work"
          />

          <SidebarItem
            icon={
              <Bell size={19} />
            }
            label="Notifications"
            to="/professional/notifications"
          />

          <SidebarItem
            icon={
              <User size={19} />
            }
            label="My Profile"
            to="/professional/profile"
          />

        </nav>

        {/* BOTTOM */}

        <div className="border-t border-slate-100 p-4">

          <SidebarItem
            icon={
              <Settings size={19} />
            }
            label="Settings"
            to="/professional/settings"
          />

          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Logout
          </button>

        </div>

      </aside>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="lg:ml-64">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur lg:px-8">

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(true)
            }
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="hidden lg:block">

            <p className="text-sm text-slate-500">
              Professional Workspace
            </p>

            <p className="font-semibold text-slate-900">
              AIBOS
            </p>

          </div>

          <div className="flex items-center gap-4">

            <button
              type="button"
              className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"
            >
              <Bell size={20} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600" />
            </button>

            <div className="hidden h-8 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                {userName
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="hidden sm:block">

                <p className="text-sm font-semibold text-slate-900">
                  {userName}
                </p>

                <p className="text-xs text-slate-500">
                  Professional
                </p>

              </div>

            </div>

          </div>

        </header>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <div className="p-6 lg:p-8">

          {/* =================================================
              WELCOME
          ================================================== */}

          <section className="mb-8">

            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Professional Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Good morning, {firstName} 👋
            </h1>

            <p className="mt-2 text-slate-500">
              Here's what's happening with
              your professional workspace
              today.
            </p>

          </section>

          {/* =================================================
              STATS
          ================================================== */}

          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Available Requests"
              value={String(
                serviceRequests.length
              )}
              subtitle="Customer requests"
              icon={
                <Briefcase size={21} />
              }
            />

            <StatCard
              title="Active Work"
              value="0"
              subtitle="Current jobs"
              icon={
                <CheckCircle2
                  size={21}
                />
              }
            />

            <StatCard
              title="Total Earnings"
              value="₹0"
              subtitle="From completed work"
              icon={
                <DollarSign size={21} />
              }
            />

            <StatCard
              title="Your Rating"
              value="—"
              subtitle="Complete jobs to receive ratings"
              icon={
                <Star size={21} />
              }
            />

          </section>

          {/* =================================================
              AVAILABLE SERVICE REQUESTS
          ================================================== */}

          <section className="mt-10">

            {/* SECTION HEADER */}

            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">

                    <Search size={17} />

                  </div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Available Service Requests
                  </h2>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Customer requests waiting
                  for professionals.
                </p>

              </div>

              {/* REFRESH */}

              <button
                type="button"
                onClick={
                  fetchServiceRequests
                }
                disabled={
                  requestsLoading
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <RefreshCw
                  size={16}
                  className={
                    requestsLoading
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh

              </button>

            </div>

            {/* =================================================
                LOADING
            ================================================== */}

            {requestsLoading && (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                <p className="mt-4 text-sm text-slate-500">
                  Loading customer requests...
                </p>

              </div>
            )}

            {/* =================================================
                ERROR
            ================================================== */}

            {!requestsLoading &&
              requestsError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

                  <p className="font-semibold text-red-700">
                    Unable to load requests
                  </p>

                  <p className="mt-1 text-sm text-red-600">
                    {requestsError}
                  </p>

                  <button
                    type="button"
                    onClick={
                      fetchServiceRequests
                    }
                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    Try Again
                  </button>

                </div>
              )}

            {/* =================================================
                EMPTY
            ================================================== */}

            {!requestsLoading &&
              !requestsError &&
              serviceRequests.length ===
                0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">

                    <Search size={25} />

                  </div>

                  <h3 className="mt-4 font-semibold text-slate-900">
                    No service requests yet
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    New customer requests will
                    appear here.
                  </p>

                </div>
              )}

            {/* =================================================
                REQUEST LIST
            ================================================== */}

            {!requestsLoading &&
              !requestsError &&
              serviceRequests.length > 0 && (
                <div className="space-y-5">

                  {serviceRequests.map(
                    (request) => (
                      <ServiceRequestCard
                        key={request._id}
                        request={request}
                        accepting={
                          acceptingId ===
                          request._id
                        }
                        rejecting={
                          rejectingId ===
                          request._id
                        }
                        onAccept={
                          handleAcceptRequest
                        }
                        onReject={
                          handleRejectRequest
                        }
                        formatDate={
                          formatDate
                        }
                      />
                    )
                  )}

                </div>
              )}

          </section>

          {/* =================================================
              AI RECOMMENDED JOBS
          ================================================== */}

          <section className="mt-10">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    ✦
                  </div>

                  <h2 className="text-xl font-bold text-slate-900">
                    AI Recommended Jobs
                  </h2>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  AI matching will appear here
                  as we improve the platform.
                </p>

              </div>

              <Link
                to="/professional/jobs"
                className="hidden items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 sm:flex"
              >
                View all
                <ChevronRight size={16} />
              </Link>

            </div>

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">

              <p className="font-semibold text-slate-700">
                AI matching coming next
              </p>

              <p className="mt-2 text-sm text-slate-500">
                AIBOS will match professionals
                with requests based on skills,
                location, experience,
                availability and rating.
              </p>

            </div>

          </section>

          {/* =================================================
              RECENT APPLICATIONS
          ================================================== */}

          <section className="mt-10">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Recent Applications
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Track your latest job
                  applications.
                </p>

              </div>

              <Link
                to="/professional/applications"
                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View all

                <ChevronRight
                  size={16}
                />

              </Link>

            </div>

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">

              <p className="font-semibold text-slate-700">
                No applications yet
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Applications will appear
                here when you apply for
                jobs.
              </p>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

// ============================================================
// SERVICE REQUEST CARD
// ============================================================

function ServiceRequestCard({
  request,
  accepting,
  rejecting,
  onAccept,
  onReject,
  formatDate,
}: {
  request: ServiceRequest;

  accepting: boolean;

  rejecting: boolean;

  onAccept: (
    id: string
  ) => void;

  onReject: (
    id: string
  ) => void;

  formatDate: (
    date?: string
  ) => string;
}) {
  const isBusy =
    accepting || rejecting;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      {/* ==================================================
          TOP
      ================================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row">

        <div className="min-w-0">

          <div className="flex flex-wrap items-center gap-2">

            {/* CATEGORY */}

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
              {request.category}
            </span>

            {/* STATUS */}

            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold capitalize text-amber-700">
              {request.status}
            </span>

          </div>

          {/* DESCRIPTION */}

          <h3 className="mt-3 break-words text-lg font-bold text-slate-900">
            {request.description}
          </h3>

        </div>

        {/* BUDGET */}

        {request.budget !==
          undefined &&
          request.budget > 0 && (
            <div className="shrink-0 sm:text-right">

              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Budget
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                ₹{request.budget}
              </p>

            </div>
          )}

      </div>

      {/* ==================================================
          REQUEST DETAILS
      ================================================== */}

      <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">

        {/* LOCATION */}

        <div className="flex items-start gap-3">

          <div className="rounded-lg bg-slate-100 p-2 text-slate-500">
            <MapPin size={17} />
          </div>

          <div>

            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Location
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-700">
              {request.location}
            </p>

          </div>

        </div>

        {/* DATE */}

        <div>

          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Preferred Date
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            {formatDate(
              request.preferredDate
            )}
          </p>

        </div>

        {/* TIME */}

        <div>

          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Preferred Time
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            {request.preferredTime ||
              "Flexible"}
          </p>

        </div>

      </div>

      {/* ==================================================
          CUSTOMER
      ================================================== */}

      <div className="mt-5 rounded-xl bg-slate-50 p-4">

        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Requested By
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-900">
          {request.customer?.fullName ||
            "Customer"}
        </p>

        {request.customer?.phone && (
          <p className="mt-1 text-sm text-slate-500">
            {request.customer.phone}
          </p>
        )}

      </div>

      {/* ==================================================
          ACTION BUTTONS
      ================================================== */}

      <div className="mt-5 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

        {/* SKIP */}

        <button
          type="button"
          disabled={isBusy}
          onClick={() =>
            onReject(request._id)
          }
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {rejecting
            ? "Skipping..."
            : "Skip"}
        </button>

        {/* ACCEPT */}

        <button
          type="button"
          disabled={isBusy}
          onClick={() =>
            onAccept(request._id)
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >

          {accepting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

              Accepting...
            </>
          ) : (
            <>
              <CheckCircle2
                size={17}
              />

              Accept Request
            </>
          )}

        </button>

      </div>

    </div>
  );
}

// ============================================================
// SIDEBAR ITEM
// ============================================================

function SidebarItem({
  icon,
  label,
  to,
  active = false,
}: {
  icon: ReactNode;

  label: string;

  to: string;

  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-blue-50 text-blue-700"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {icon}

      {label}
    </Link>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;

  value: string;

  subtitle: string;

  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>

        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

      </div>

    </div>
  );
}