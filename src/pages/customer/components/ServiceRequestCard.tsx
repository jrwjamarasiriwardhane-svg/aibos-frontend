import React from "react";
import type { ServiceRequest } from "../types/ServiceRequest";

interface ServiceRequestCardProps {
  request: ServiceRequest;
  onView?: (request: ServiceRequest) => void;
  onCancel?: (request: ServiceRequest) => void;
}

const ServiceRequestCard: React.FC<
  ServiceRequestCardProps
> = ({
  request,
  onView,
  onCancel,
}) => {
  // =====================================================
  // STATUS CONFIG
  // =====================================================

  const statusConfig = {
    pending: {
      label: "Pending",
      background: "#fff7ed",
      color: "#ea580c",
    },

    matched: {
      label: "Matched",
      background: "#eff6ff",
      color: "#2563eb",
    },

    accepted: {
      label: "Accepted",
      background: "#ecfdf5",
      color: "#059669",
    },

    in_progress: {
      label: "In Progress",
      background: "#eff6ff",
      color: "#2563eb",
    },

    completed: {
      label: "Completed",
      background: "#ecfdf5",
      color: "#059669",
    },

    cancelled: {
      label: "Cancelled",
      background: "#fef2f2",
      color: "#dc2626",
    },
  };

  const status =
    statusConfig[
      request.status as keyof typeof statusConfig
    ] || statusConfig.pending;

  // =====================================================
  // DATE
  // =====================================================

  const createdDate = request.createdAt
    ? new Date(request.createdAt).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : "Unknown date";

  // =====================================================
  // ACTIONS
  // =====================================================

  const canCancel =
    request.status === "pending";

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "16px",
        boxShadow:
          "0 2px 6px rgba(15, 23, 42, 0.04)",
      }}
    >
      {/* ================================================= */}
      {/* TOP */}
      {/* ================================================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "19px",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              {request.category}
            </h3>

            <span
              style={{
                background: status.background,
                color: status.color,
                padding: "5px 10px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              {status.label}
            </span>
          </div>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: "13px",
              color: "#94a3b8",
            }}
          >
            Requested on {createdDate}
          </p>
        </div>

        <div
          style={{
            fontSize: "20px",
          }}
        >
          🛠️
        </div>
      </div>

      {/* ================================================= */}
      {/* DESCRIPTION */}
      {/* ================================================= */}

      <div
        style={{
          marginTop: "20px",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#475569",
            lineHeight: 1.6,
            fontSize: "14px",
          }}
        >
          {request.description}
        </p>
      </div>

      {/* ================================================= */}
      {/* DETAILS */}
      {/* ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginTop: "20px",
        }}
      >
        {/* LOCATION */}

        <div
          style={{
            background: "#f8fafc",
            borderRadius: "10px",
            padding: "13px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#94a3b8",
              marginBottom: "5px",
            }}
          >
            Location
          </div>

          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#334155",
            }}
          >
            📍 {request.location}
          </div>
        </div>

        {/* DATE */}

        {request.preferredDate && (
          <div
            style={{
              background: "#f8fafc",
              borderRadius: "10px",
              padding: "13px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#94a3b8",
                marginBottom: "5px",
              }}
            >
              Preferred Date
            </div>

            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#334155",
              }}
            >
              📅{" "}
              {new Date(
                request.preferredDate
              ).toLocaleDateString("en-IN")}
            </div>
          </div>
        )}

        {/* TIME */}

        {request.preferredTime && (
          <div
            style={{
              background: "#f8fafc",
              borderRadius: "10px",
              padding: "13px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#94a3b8",
                marginBottom: "5px",
              }}
            >
              Preferred Time
            </div>

            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#334155",
              }}
            >
              🕒 {request.preferredTime}
            </div>
          </div>
        )}

        {/* BUDGET */}

        {request.budget !== undefined &&
          request.budget > 0 && (
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "10px",
                padding: "13px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  marginBottom: "5px",
                }}
              >
                Budget
              </div>

              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#334155",
                }}
              >
                ₹{request.budget}
              </div>
            </div>
          )}
      </div>

      {/* ================================================= */}
      {/* PROFESSIONAL */}
      {/* ================================================= */}

      {request.assignedProfessional && (
        <div
          style={{
            marginTop: "18px",
            padding: "14px",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#15803d",
              marginBottom: "5px",
            }}
          >
            Assigned Professional
          </div>

          <div
            style={{
              fontWeight: 600,
              color: "#166534",
            }}
          >
            {typeof request.assignedProfessional ===
            "object"
              ? request.assignedProfessional.fullName
              : "Professional assigned"}
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* ACTIONS */}
      {/* ================================================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          marginTop: "20px",
          paddingTop: "18px",
          borderTop: "1px solid #f1f5f9",
        }}
      >
        {canCancel && onCancel && (
          <button
            type="button"
            onClick={() => onCancel(request)}
            style={{
              padding: "10px 16px",
              borderRadius: "9px",
              border: "1px solid #fecaca",
              background: "#ffffff",
              color: "#dc2626",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Cancel Request
          </button>
        )}

        {onView && (
          <button
            type="button"
            onClick={() => onView(request)}
            style={{
              padding: "10px 18px",
              borderRadius: "9px",
              border: "none",
              background: "#2563eb",
              color: "#ffffff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default ServiceRequestCard;