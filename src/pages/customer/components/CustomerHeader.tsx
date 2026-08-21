import { useState, useEffect } from "react";

interface CustomerUser {
  id?: string;
  fullName?: string;
  role?: string;
  profileImage?: string;
}

interface CustomerHeaderProps {
  user?: CustomerUser | null;
}

export default function CustomerHeader({ user }: CustomerHeaderProps) {
  const [imgError, setImgError] = useState(false);

  // Reset image error state whenever user profile image changes
  useEffect(() => {
    setImgError(false);
  }, [user?.profileImage]);

  const firstLetter = user?.fullName?.charAt(0)?.toUpperCase() || "S";

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* WORKSPACE TITLE */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Customer Workspace
        </p>
        <h1 className="text-lg font-extrabold text-slate-900">AIBOS</h1>
      </div>

      {/* USER PROFILE IN HEADER */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-bold text-slate-900">
            {user?.fullName || "Sahilnew"}
          </p>
          <p className="text-xs text-slate-500">
            {user?.role || "Customer"}
          </p>
        </div>

        {/* DYNAMIC AVATAR */}
        {user?.profileImage && !imgError ? (
          <img
            src={user.profileImage}
            alt={user.fullName || "User Avatar"}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-200"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 ring-2 ring-slate-200">
            {firstLetter}
          </div>
        )}
      </div>
    </header>
  );
}