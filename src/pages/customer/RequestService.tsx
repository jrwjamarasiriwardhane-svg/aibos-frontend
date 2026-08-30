import React, { useState } from "react";
import type { FormEvent } from "react";

import { useNavigate } from "react-router-dom";

import {
  createServiceRequest,
} from "./services/serviceRequestService";

const RequestService: React.FC = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [budget, setBudget] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  // =====================================================
  // SUBMIT REQUEST
  // =====================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("Your session has expired. Please login again.");
      return;
    }

    if (!category || !description || !location) {
      setError(
        "Please fill in category, description and location."
      );
      return;
    }

    try {
      setLoading(true);

      await createServiceRequest(token, {
        category,
        description,
        location,
        preferredDate:
          preferredDate || null,
        preferredTime,
        budget: budget
          ? Number(budget)
          : 0,
      });

      setSuccess(
        "Service request created successfully!"
      );

      // Clear form
      setCategory("");
      setDescription("");
      setLocation("");
      setPreferredDate("");
      setPreferredTime("");
      setBudget("");

      // Go to dashboard after short delay
      setTimeout(() => {
        navigate("/customer/dashboard");
      }, 1000);
    } catch (err: any) {
      console.error(
        "CREATE SERVICE REQUEST ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to create service request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
        }}
      >
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div
          style={{
            marginBottom: "28px",
          }}
        >
          <button
            type="button"
            onClick={() =>
              navigate("/customer/dashboard")
            }
            style={{
              border: "none",
              background: "transparent",
              color: "#2563eb",
              cursor: "pointer",
              fontWeight: 600,
              padding: 0,
              marginBottom: "18px",
            }}
          >
            ← Back to Dashboard
          </button>

          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              color: "#0f172a",
            }}
          >
            Request a Service
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#64748b",
              fontSize: "16px",
            }}
          >
            Tell us what service you need and AIBOS
            will help connect you with suitable
            professionals.
          </p>
        </div>

        {/* ================================================= */}
        {/* FORM CARD */}
        {/* ================================================= */}

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "18px",
            padding: "32px",
            boxShadow:
              "0 4px 12px rgba(15, 23, 42, 0.05)",
          }}
        >
          {/* ERROR */}

          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "14px 16px",
                borderRadius: "10px",
                marginBottom: "22px",
              }}
            >
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div
              style={{
                background: "#ecfdf5",
                border: "1px solid #bbf7d0",
                color: "#15803d",
                padding: "14px 16px",
                borderRadius: "10px",
                marginBottom: "22px",
              }}
            >
              {success}
            </div>
          )}

          {/* ================================================= */}
          {/* CATEGORY */}
          {/* ================================================= */}

          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
                color: "#334155",
              }}
            >
              Service Category *
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              required
              style={{
                width: "100%",
                padding: "13px 14px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontSize: "15px",
                background: "#ffffff",
              }}
            >
              <option value="">
                Select a service
              </option>

              <option value="Electrician">
                Electrician
              </option>

              <option value="AC Repair">
                AC Repair
              </option>

              <option value="Plumber">
                Plumber
              </option>

              <option value="Carpenter">
                Carpenter
              </option>

              <option value="Mason">
                Mason
              </option>

              <option value="Painter">
                Painter
              </option>

              <option value="Mechanic">
                Mechanic
              </option>

              <option value="Cleaning">
                Cleaning
              </option>

              <option value="Restaurant Helper">
                Restaurant Helper
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          {/* ================================================= */}
          {/* DESCRIPTION */}
          {/* ================================================= */}

          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
                color: "#334155",
              }}
            >
              What do you need? *
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              required
              rows={5}
              placeholder="Describe the service you need..."
              style={{
                width: "100%",
                padding: "13px 14px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontSize: "15px",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* ================================================= */}
          {/* LOCATION */}
          {/* ================================================= */}

          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
                color: "#334155",
              }}
            >
              Service Location *
            </label>

            <input
              type="text"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              required
              placeholder="e.g. Mumbai, Andheri"
              style={{
                width: "100%",
                padding: "13px 14px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* ================================================= */}
          {/* DATE + TIME */}
          {/* ================================================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 600,
                  color: "#334155",
                }}
              >
                Preferred Date
              </label>

              <input
                type="date"
                value={preferredDate}
                onChange={(e) =>
                  setPreferredDate(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "13px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "15px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 600,
                  color: "#334155",
                }}
              >
                Preferred Time
              </label>

              <input
                type="time"
                value={preferredTime}
                onChange={(e) =>
                  setPreferredTime(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "13px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "15px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* ================================================= */}
          {/* BUDGET */}
          {/* ================================================= */}

          <div
            style={{
              marginBottom: "28px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
                color: "#334155",
              }}
            >
              Estimated Budget
            </label>

            <input
              type="number"
              min="0"
              value={budget}
              onChange={(e) =>
                setBudget(e.target.value)
              }
              placeholder="e.g. 2500"
              style={{
                width: "100%",
                padding: "13px 14px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
            />

            <p
              style={{
                marginTop: "7px",
                marginBottom: 0,
                fontSize: "12px",
                color: "#94a3b8",
              }}
            >
              This helps professionals understand
              your expected budget.
            </p>
          </div>

          {/* ================================================= */}
          {/* SUBMIT */}
          {/* ================================================= */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              background: loading
                ? "#94a3b8"
                : "#2563eb",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 700,
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Creating Request..."
              : "Create Service Request →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestService;