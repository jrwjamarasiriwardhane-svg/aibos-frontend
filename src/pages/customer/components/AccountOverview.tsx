import { useState, useRef } from "react";

interface CustomerUser {
  id?: string;
  fullName?: string;
  email?: string;
  role?: string;
  profileImage?: string;
}

interface Props {
  user?: CustomerUser | null;
  onImageChange?: (file: File) => void;
  onImageDelete?: () => void;
}

export default function AccountOverview({ user, onImageChange, onImageDelete }: Props) {
  const [imgError, setImgError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const firstLetter = user?.fullName?.charAt(0)?.toUpperCase() || "C";
  const API_BASE_URL =
    (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000";

  const defaultImage = user?.profileImage
    ? user.profileImage
    : user?.id
    ? `${API_BASE_URL}/api/users/profile-image/${user.id}`
    : null;

  // Selected file preview or existing avatar
  const displayImage = previewUrl || defaultImage;
  const hasPhoto = Boolean(displayImage) && !imgError;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setImgError(false);
      if (onImageChange) {
        onImageChange(file);
      }
    }
  };

  const handleDeletePhoto = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents opening the file input dialog
    setPreviewUrl(null);
    setImgError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onImageDelete) {
      onImageDelete();
    }
  };

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* HEADER WITH CLICKABLE AVATAR & DELETE ACTION */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          
          {/* CLICKABLE AVATAR CONTAINER */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group relative cursor-pointer"
            title="Click to update profile photo"
          >
            {hasPhoto ? (
              <img
                src={displayImage!}
                alt={user?.fullName || "Profile Photo"}
                className="h-16 w-16 rounded-2xl object-cover ring-4 ring-slate-100 shadow-sm transition group-hover:opacity-80"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-2xl font-bold text-blue-600 ring-4 ring-slate-100 transition group-hover:bg-blue-200">
                {firstLetter}
              </div>
            )}

            {/* OVERLAY EDIT ICON */}
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-900/40 opacity-0 transition-opacity group-hover:opacity-100">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>

            {/* SMALL CORNER ADD BADGE */}
            <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-blue-600 p-1 text-white shadow-sm">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Account Overview
            </h2>

            {/* ACTIONS: UPLOAD & DELETE */}
            <div className="mt-1 flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                {hasPhoto ? "Change Photo" : "Upload Photo"}
              </button>

              {hasPhoto && (
                <>
                  <span className="h-3 w-px bg-slate-300" />
                  <button
                    type="button"
                    onClick={handleDeletePhoto}
                    className="text-xs font-semibold text-rose-600 hover:underline"
                  >
                    Delete Photo
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* INFORMATION GRID */}
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <Info
          label="Full Name"
          value={user?.fullName || "-"}
        />

        <Info
          label="Email Address"
          value={user?.email || "-"}
        />

        <Info
          label="Account Role"
          value={user?.role || "Customer"}
        />
      </div>

    </section>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900 capitalize">
        {value}
      </p>
    </div>
  );
}