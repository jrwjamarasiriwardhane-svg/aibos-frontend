import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  MapPin,
  Save,
  ShieldCheck,
  Star,
  Briefcase,
  ArrowLeft,
} from "lucide-react";

interface ProfessionalProfile {
  bio: string;
  skills: string[];
  experienceYears: number;
  location: string;
  hourlyRate: number;
  isAvailable: boolean;

  verificationStatus:
    | "pending"
    | "under_review"
    | "verified"
    | "rejected"
    | "suspended";

  identityVerified: boolean;
  skillsVerified: boolean;

  rating: number;
  totalJobs: number;
  completedJobs: number;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [profile, setProfile] =
    useState<ProfessionalProfile>({
      bio: "",
      skills: [],
      experienceYears: 0,
      location: "",
      hourlyRate: 0,
      isAvailable: true,
      verificationStatus: "pending",
      identityVerified: false,
      skillsVerified: false,
      rating: 0,
      totalJobs: 0,
      completedJobs: 0,
    });

  const [skillsText, setSkillsText] =
    useState("");

  const token = localStorage.getItem("token");

  const apiUrl =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  // ======================================================
  // LOAD PROFILE
  // ======================================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/professional-profile/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load profile"
          );
        }

        const loadedProfile =
          data.profile;

        setProfile(loadedProfile);

        setSkillsText(
          loadedProfile.skills?.join(", ") || ""
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [apiUrl, token]);

  // ======================================================
  // SAVE PROFILE
  // ======================================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const skills = skillsText
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const response = await fetch(
        `${apiUrl}/professional-profile/me`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...profile,
            skills,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save profile"
        );
      }

      setProfile(data.profile);

      setMessage(
        "Professional profile updated successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-500">
          Loading professional profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/professional/dashboard")}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={15} />
              Dashboard
            </button>
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase">
                AIBOS Professional
              </p>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Profile & Verification
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck size={18} className="text-emerald-600" />
            <span className="hidden sm:inline">Secure Workspace</span>
          </div>
        </div>
      </header>

      {/* Main */}

      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* Verification Banner */}

        <VerificationBanner
          status={profile.verificationStatus}
          identityVerified={profile.identityVerified}
          skillsVerified={profile.skillsVerified}
        />

        {/* Alerts */}

        {message && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Left */}

          <div className="space-y-6 lg:col-span-2">

            {/* About */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6">

              <h2 className="text-lg font-bold text-slate-900">
                Professional Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                This information helps AIBOS match you with
                suitable opportunities.
              </p>

              <div className="mt-6 space-y-5">

                {/* Bio */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Professional Bio
                  </label>

                  <textarea
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        bio: e.target.value,
                      })
                    }
                    rows={5}
                    placeholder="Tell customers and companies about your experience..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

                {/* Skills */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Skills
                  </label>

                  <input
                    value={skillsText}
                    onChange={(e) =>
                      setSkillsText(e.target.value)
                    }
                    placeholder="Electrician, AC Repair, Wiring"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Separate skills using commas.
                  </p>

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* Experience */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Experience (Years)
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={profile.experienceYears}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          experienceYears:
                            Number(e.target.value),
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>

                  {/* Rate */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Hourly Rate
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={profile.hourlyRate}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          hourlyRate:
                            Number(e.target.value),
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>

                </div>

                {/* Location */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Location
                  </label>

                  <div className="relative">

                    <MapPin
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      value={profile.location}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          location: e.target.value,
                        })
                      }
                      placeholder="Mumbai"
                      className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>

                </div>

                {/* Availability */}

                <label className="flex cursor-pointer items-center gap-3">

                  <input
                    type="checkbox"
                    checked={profile.isAvailable}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        isAvailable:
                          e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-600"
                  />

                  <span className="text-sm font-medium text-slate-700">
                    I am currently available for work
                  </span>

                </label>

                {/* Save */}

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={18} />

                  {saving
                    ? "Saving..."
                    : "Save Profile"}
                </button>

              </div>

            </section>

          </div>

          {/* Right */}

          <div className="space-y-6">

            {/* Verification */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ShieldCheck size={22} />
                </div>

                <div>

                  <h2 className="font-bold text-slate-900">
                    Verification
                  </h2>

                  <p className="text-xs text-slate-500">
                    Build customer trust
                  </p>

                </div>

              </div>

              <div className="mt-6 space-y-4">

                <VerificationItem
                  title="Identity Verification"
                  verified={
                    profile.identityVerified
                  }
                />

                <VerificationItem
                  title="Skill Verification"
                  verified={
                    profile.skillsVerified
                  }
                />

              </div>

              <button
                type="button"
                className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Complete Verification
              </button>

              <p className="mt-3 text-center text-xs leading-5 text-slate-400">
                Your identity documents are private and
                are only accessible to authorized AIBOS
                administrators.
              </p>

            </section>

            {/* Stats */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6">

              <h2 className="font-bold text-slate-900">
                Professional Performance
              </h2>

              <div className="mt-5 space-y-4">

                <PerformanceRow
                  icon={<Star size={18} />}
                  label="Rating"
                  value={`${profile.rating.toFixed(1)} / 5`}
                />

                <PerformanceRow
                  icon={<Briefcase size={18} />}
                  label="Total Jobs"
                  value={String(
                    profile.totalJobs
                  )}
                />

                <PerformanceRow
                  icon={<CheckCircle2 size={18} />}
                  label="Completed"
                  value={String(
                    profile.completedJobs
                  )}
                />

              </div>

            </section>

          </div>

        </div>

      </main>

    </div>
  );
}

/* ============================================================
   VERIFICATION BANNER
============================================================ */

function VerificationBanner({
  status,
  identityVerified,
  skillsVerified,
}: {
  status: string;
  identityVerified: boolean;
  skillsVerified: boolean;
}) {
  const isVerified =
    status === "verified";

  return (
    <div
      className={`mb-8 rounded-2xl border p-6 ${
        isVerified
          ? "border-emerald-200 bg-emerald-50"
          : "border-amber-200 bg-amber-50"
      }`}
    >

      <div className="flex items-start gap-4">

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            isVerified
              ? "bg-emerald-100 text-emerald-600"
              : "bg-amber-100 text-amber-600"
          }`}
        >
          {isVerified ? (
            <CheckCircle2 size={22} />
          ) : (
            <ShieldCheck size={22} />
          )}
        </div>

        <div>

          <h2 className="font-bold text-slate-900">

            {isVerified
              ? "AIBOS Verified Professional"
              : "Verification Required"}

          </h2>

          <p className="mt-1 text-sm text-slate-600">

            {isVerified
              ? "Your identity and professional information have been verified."
              : "Complete identity and skill verification before receiving customer requests."}

          </p>

          <div className="mt-4 flex flex-wrap gap-3">

            <Badge
              label="Identity"
              verified={identityVerified}
            />

            <Badge
              label="Skills"
              verified={skillsVerified}
            />

          </div>

        </div>

      </div>

    </div>
  );
}

/* ============================================================
   VERIFICATION ITEM
============================================================ */

function VerificationItem({
  title,
  verified,
}: {
  title: string;
  verified: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">

      <span className="text-sm font-medium text-slate-700">
        {title}
      </span>

      {verified ? (
        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <CheckCircle2 size={15} />
          Verified
        </span>
      ) : (
        <span className="text-xs font-semibold text-amber-600">
          Pending
        </span>
      )}

    </div>
  );
}

/* ============================================================
   BADGE
============================================================ */

function Badge({
  label,
  verified,
}: {
  label: string;
  verified: boolean;
}) {
  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
        verified
          ? "bg-emerald-100 text-emerald-700"
          : "bg-white text-slate-600"
      }`}
    >
      {verified ? "✓" : "○"} {label}
    </span>
  );
}

/* ============================================================
   PERFORMANCE ROW
============================================================ */

function PerformanceRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3 text-slate-500">

        <div className="text-blue-600">
          {icon}
        </div>

        <span className="text-sm">
          {label}
        </span>

      </div>

      <span className="text-sm font-bold text-slate-900">
        {value}
      </span>

    </div>
  );
}