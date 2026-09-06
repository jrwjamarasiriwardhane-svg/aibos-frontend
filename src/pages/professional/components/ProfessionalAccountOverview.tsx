import { useState, useRef } from "react";
import { Camera, Trash2, ShieldCheck, User as UserIcon, Loader2, Sparkles } from "lucide-react";

interface ProfessionalUser {
  id?: string;
  _id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  profileImage?: string;
}

interface Props {
  user?: ProfessionalUser | null;
  onImageChange?: (file: File) => Promise<void> | void;
  onImageDelete?: () => Promise<void> | void;
  uploading?: boolean;
  isVerified?: boolean;
}

export default function ProfessionalAccountOverview({
  user,
  onImageChange,
  onImageDelete,
  uploading = false,
  isVerified = false,
}: Props) {
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const firstLetter = user?.fullName?.charAt(0)?.toUpperCase() || "P";
  const userId = user?.id || user?._id;
  const API_BASE_URL =
    (import.meta as any).env?.VITE_API_BASE_URL ||
    (import.meta as any).env?.VITE_API_URL?.replace(/\/api$/, "") ||
    "http://localhost:5000";

  // Use profileImage path or fallback to stream endpoint if user has ID
  const displayImage = user?.profileImage
    ? user.profileImage.startsWith("blob:") || user.profileImage.startsWith("http") || user.profileImage.startsWith("data:")
      ? user.profileImage
      : `${API_BASE_URL}${user.profileImage}`
    : userId
    ? `${API_BASE_URL}/api/users/profile-image/${userId}`
    : null;

  const hasPhoto = Boolean(displayImage) && !imgError;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImgError(false);
      if (onImageChange) {
        await onImageChange(file);
      }
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onImageDelete) {
      await onImageDelete();
    }
  };

  return (
    <section className="mb-8 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-7">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
      />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Interactive Avatar & Name */}
        <div className="flex items-center gap-5">
          {/* Avatar Container with Hover Overlay & Badge */}
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className="group relative cursor-pointer select-none"
            title="Click to update professional profile photo"
          >
            <div className={`relative h-20 w-20 rounded-2xl overflow-hidden shadow-md ring-4 ${
              isVerified ? "ring-emerald-400/40" : "ring-slate-100"
            }`}>
              {hasPhoto ? (
                <img
                  src={displayImage!}
                  alt={user?.fullName || "Professional"}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:opacity-85"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600 text-3xl font-extrabold text-white shadow-inner">
                  {firstLetter}
                </div>
              )}

              {/* Uploading Spinner Overlay */}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 text-white backdrop-blur-xs">
                  <Loader2 size={24} className="animate-spin text-cyan-400" />
                </div>
              )}

              {/* Hover Edit Overlay */}
              {!uploading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100 text-white backdrop-blur-xs">
                  <Camera size={22} className="drop-shadow" />
                  <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider">Change</span>
                </div>
              )}
            </div>

            {/* Corner Camera / Verified Badge */}
            <div
              className={`absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-xl border-2 border-white shadow-sm transition group-hover:scale-110 ${
                isVerified ? "bg-emerald-500 text-white" : "bg-blue-600 text-white"
              }`}
            >
              {isVerified ? (
                <ShieldCheck size={14} />
              ) : (
                <Camera size={13} />
              )}
            </div>
          </div>

          {/* User Details & Action Buttons */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {user?.fullName || "Professional"}
              </h2>
              {isVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                  <Sparkles size={11} className="text-emerald-600" />
                  Verified Pro
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              {user?.email || "No email linked"}
            </p>

            {/* Quick Actions */}
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 disabled:opacity-50"
              >
                <Camera size={13} />
                {hasPhoto ? "Change Photo" : "Upload Photo"}
              </button>

              {hasPhoto && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
                >
                  <Trash2 size={13} />
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Info Chips */}
        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 sm:border-t-0 sm:pt-0 sm:flex sm:gap-4">
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-left">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Account Role</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 capitalize flex items-center gap-1.5 mt-0.5">
              <UserIcon size={14} className="text-blue-600" />
              {user?.role || "Professional"}
            </span>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-left">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <span className={`h-2 w-2 rounded-full ${isVerified ? "bg-emerald-500" : "bg-amber-400"}`} />
              {isVerified ? "Verified" : "Pending Review"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
