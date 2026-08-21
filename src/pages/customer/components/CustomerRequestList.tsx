import type { ServiceRequest } from "../types/ServiceRequest";

interface CustomerRequestListProps {
  requests: ServiceRequest[];
  loading: boolean;
  error: string;
  onRefresh: () => void;
  onCreateRequest: () => void;
}

// =====================================================
// STATUS STYLE
// =====================================================

const getStatusStyle = (
  status: ServiceRequest["status"]
) => {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 ring-amber-200";

    case "matched":
      return "bg-indigo-50 text-indigo-700 ring-indigo-200";

    case "accepted":
      return "bg-blue-50 text-blue-700 ring-blue-200";

    case "in_progress":
      return "bg-purple-50 text-purple-700 ring-purple-200";

    case "completed":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";

    case "cancelled":
      return "bg-red-50 text-red-700 ring-red-200";

    default:
      return "bg-slate-50 text-slate-700 ring-slate-200";
  }
};

// =====================================================
// STATUS TEXT
// =====================================================

const formatStatus = (
  status: ServiceRequest["status"]
) => {
  return status
    .replace("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function CustomerRequestList({
  requests,
  loading,
  error,
  onRefresh,
  onCreateRequest,
}: CustomerRequestListProps) {
  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            My Service Requests
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track all your previous and active service
            requests.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>

      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="py-14 text-center">

          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading your service requests...
          </p>

        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {!loading && error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">

          <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">
              !
            </div>

            <div>
              <h3 className="font-semibold text-red-700">
                Unable to load requests
              </h3>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onRefresh}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Try Again
          </button>

        </div>
      )}

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!loading &&
        !error &&
        requests.length === 0 && (
          <div className="py-14 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
              📋
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No service requests yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You haven't created any service requests
              yet. Create your first request and find the
              right professional for your job.
            </p>

            <button
              type="button"
              onClick={onCreateRequest}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
            >
              + Create Service Request
            </button>

          </div>
        )}

      {/* =================================================
          REQUEST LIST
      ================================================= */}

      {!loading &&
        !error &&
        requests.length > 0 && (
          <div className="mt-6 space-y-4">

            {requests.map((request) => (
              <RequestItem
                key={request._id}
                request={request}
              />
            ))}

          </div>
        )}

    </section>
  );
}

// =====================================================
// SINGLE REQUEST CARD
// =====================================================

function RequestItem({
  request,
}: {
  request: ServiceRequest;
}) {
  // ---------------------------------------------------
  // CREATED DATE
  // ---------------------------------------------------

  const createdDate = request.createdAt
    ? new Date(request.createdAt).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : "-";

  // ---------------------------------------------------
  // PREFERRED DATE
  // ---------------------------------------------------

  const preferredDate = request.preferredDate
    ? new Date(
        request.preferredDate
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not specified";

  // ---------------------------------------------------
  // PROFESSIONAL OBJECT
  // ---------------------------------------------------

  const professional =
    request.assignedProfessional &&
    typeof request.assignedProfessional !== "string"
      ? request.assignedProfessional
      : null;

  // ---------------------------------------------------
  // COMPANY OBJECT
  // ---------------------------------------------------

  const company =
    request.company &&
    typeof request.company !== "string"
      ? request.company
      : null;

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 transition hover:border-slate-300 hover:shadow-sm">

      {/* =================================================
          TOP SECTION
      ================================================= */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

        <div className="min-w-0">

          <div className="flex flex-wrap items-center gap-3">

            <h3 className="text-lg font-bold text-slate-900">
              {request.category}
            </h3>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusStyle(
                request.status
              )}`}
            >
              {formatStatus(request.status)}
            </span>

          </div>

          <p className="mt-1 text-xs text-slate-400">
            Requested on {createdDate}
          </p>

        </div>

        <span className="w-fit shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
          #{request._id.slice(-6)}
        </span>

      </div>

      {/* =================================================
          DESCRIPTION
      ================================================= */}

      <div className="mt-4">

        <p className="text-sm leading-6 text-slate-600">
          {request.description}
        </p>

      </div>

      {/* =================================================
          REQUEST DETAILS
      ================================================= */}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

        <RequestDetail
          label="Location"
          value={request.location || "-"}
        />

        <RequestDetail
          label="Budget"
          value={`₹${request.budget || 0}`}
        />

        <RequestDetail
          label="Preferred Date"
          value={preferredDate}
        />

        <RequestDetail
          label="Preferred Time"
          value={
            request.preferredTime || "Not specified"
          }
        />

      </div>

      {/* =================================================
          ASSIGNED PROFESSIONAL
      ================================================= */}

      {professional && (
        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">

          <div className="flex items-center gap-3">

            {/* PROFILE IMAGE */}

            {professional.profileImage ? (
              <img
                src={professional.profileImage}
                alt={
                  professional.fullName ||
                  "Professional"
                }
                className="h-11 w-11 rounded-full object-cover ring-2 ring-white"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 ring-2 ring-white">
                {professional.fullName
                  ?.charAt(0)
                  ?.toUpperCase() || "P"}
              </div>
            )}

            {/* PROFESSIONAL INFO */}

            <div className="min-w-0">

              <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                Assigned Professional
              </p>

              <p className="mt-0.5 font-bold text-slate-900">
                {professional.fullName ||
                  "Professional"}
              </p>

              {professional.phone && (
                <p className="text-xs text-slate-500">
                  {professional.phone}
                </p>
              )}

              {professional.email && (
                <p className="text-xs text-slate-500">
                  {professional.email}
                </p>
              )}

            </div>

          </div>

          {/* ACCEPTED MESSAGE */}

          {request.status === "accepted" && (
            <div className="mt-4 rounded-lg bg-white/70 px-3 py-2">

              <p className="text-xs font-medium text-blue-700">
                ✓ Your request has been accepted by this
                professional.
              </p>

            </div>
          )}

          {/* IN PROGRESS */}

          {request.status === "in_progress" && (
            <div className="mt-4 rounded-lg bg-white/70 px-3 py-2">

              <p className="text-xs font-medium text-purple-700">
                Work is currently in progress.
              </p>

            </div>
          )}

          {/* COMPLETED */}

          {request.status === "completed" && (
            <div className="mt-4 rounded-lg bg-white/70 px-3 py-2">

              <p className="text-xs font-medium text-emerald-700">
                ✓ Service completed successfully.
              </p>

            </div>
          )}

        </div>
      )}

      {/* =================================================
          COMPANY
      ================================================= */}

      {company && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              🏢
            </div>

            <div>

              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Selected Company
              </p>

              <p className="mt-0.5 font-bold text-slate-900">
                {company.fullName || "Company"}
              </p>

              {company.email && (
                <p className="text-xs text-slate-500">
                  {company.email}
                </p>
              )}

              {company.phone && (
                <p className="text-xs text-slate-500">
                  {company.phone}
                </p>
              )}

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          PENDING MESSAGE
      ================================================= */}

      {request.status === "pending" && (
        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">

          <p className="text-xs font-medium text-amber-700">
            Your request is waiting for a professional to
            accept it.
          </p>

        </div>
      )}

      {/* =================================================
          MATCHED MESSAGE
      ================================================= */}

      {request.status === "matched" && (
        <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">

          <p className="text-xs font-medium text-indigo-700">
            A professional has been matched with your
            request.
          </p>

        </div>
      )}

      {/* =================================================
          CANCELLED MESSAGE
      ================================================= */}

      {request.status === "cancelled" && (
        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">

          <p className="text-xs font-medium text-red-700">
            This service request has been cancelled.
          </p>

        </div>
      )}

    </article>
  );
}

// =====================================================
// REQUEST DETAIL
// =====================================================

function RequestDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white p-3 ring-1 ring-slate-100">

      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-700">
        {value}
      </p>

    </div>
  );
}