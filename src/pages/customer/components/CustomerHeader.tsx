import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NotificationBell from "../../../components/notifications/NotificationBell";
import LiveLocationMap from "../../../components/common/LiveLocationMap";

interface CustomerUser {
  id?: string;
  _id?: string;
  fullName?: string;
  email?: string;
  role?: string;
  profileImage?: string;
}

interface CustomerHeaderProps {
  user?: CustomerUser | null;
}

export default function CustomerHeader({
  user,
}: CustomerHeaderProps) {
  const navigate = useNavigate();

  const [imgError, setImgError] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const fullName = user?.fullName || "Customer";
  const role = user?.role || "Customer";
  const firstLetter =
    fullName.charAt(0).toUpperCase() || "C";

  const userId = user?.id || user?._id;

  const profileImage =
    user?.profileImage ||
    (userId
      ? `http://localhost:5000/api/users/profile-image/${userId}`
      : "");

  useEffect(() => {
    setImgError(false);
  }, [user?.profileImage, userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/customer/login");
  };

  const handleProfileClick = () => {
    navigate("/customer/profile");
  };

  return (
    <>
      {/* ================================================= */}
      {/* CUSTOMER HEADER */}
      {/* ================================================= */}

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* ================================================= */}
          {/* LEFT - LOGO */}
          {/* ================================================= */}

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-md shadow-blue-500/20">
              A
            </div>

            <div>
              <h1 className="text-base font-bold leading-none tracking-tight text-slate-900 sm:text-lg">
                AIBOS
              </h1>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Customer Workspace
              </p>
            </div>

          </div>

          {/* ================================================= */}
          {/* RIGHT - ACTIONS */}
          {/* ================================================= */}

          <div className="flex items-center gap-3 sm:gap-4">

            {/* ================================================= */}
            {/* LIVE LOCATION BUTTON */}
            {/* ================================================= */}

            <button
              type="button"
              onClick={() => setShowMap(true)}
              title="Live Location"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-blue-600 active:scale-95"
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
                  d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"
                />

                <circle
                  cx="12"
                  cy="9"
                  r="2.5"
                  strokeWidth={2}
                />
              </svg>
            </button>

            {/* ================================================= */}
            {/* NOTIFICATION */}
            {/* ================================================= */}

            <NotificationBell />

            {/* Divider */}

            <div className="hidden h-8 w-px bg-slate-200 sm:block" />

            {/* ================================================= */}
            {/* PROFILE BUTTON */}
            {/* ================================================= */}

            <button
              type="button"
              onClick={handleProfileClick}
              title="Open Profile"
              className="group flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-50 active:scale-95"
            >

              {/* NAME */}

              <div className="hidden text-right sm:block">

                <p className="text-sm font-semibold text-slate-900 transition group-hover:text-blue-600">
                  {fullName}
                </p>

                <p className="text-xs font-medium capitalize text-slate-500">
                  {role}
                </p>

              </div>

              {/* PROFILE IMAGE */}

              {profileImage && !imgError ? (
                <img
                  src={profileImage}
                  alt={fullName}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-200 transition group-hover:ring-blue-200"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 ring-2 ring-slate-200 transition group-hover:bg-blue-200 group-hover:ring-blue-200">
                  {firstLetter}
                </div>
              )}

            </button>

            {/* ================================================= */}
            {/* LOGOUT */}
            {/* ================================================= */}

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
            >
              Logout
            </button>

          </div>
        </div>
      </header>

      {/* ================================================= */}
      {/* LIVE LOCATION MAP MODAL */}
      {/* ================================================= */}

      {showMap && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowMap(false)}
        >

          {/* ================================================= */}
          {/* MAP CONTAINER */}
          {/* ================================================= */}

          <div
            className="relative h-[80vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* ================================================= */}
            {/* MAP HEADER */}
            {/* ================================================= */}

            <div className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-5">

              <div>
                <h2 className="font-bold text-slate-900">
                  Live Location
                </h2>

                <p className="text-xs text-slate-500">
                  Your current location
                </p>
              </div>

              {/* CLOSE BUTTON */}

              <button
                type="button"
                onClick={() => setShowMap(false)}
                title="Close Map"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                ×
              </button>

            </div>

            {/* ================================================= */}
            {/* MAP */}
            {/* ================================================= */}

            <div className="h-[calc(100%-56px)] w-full">
              <LiveLocationMap />
            </div>

          </div>
        </div>
      )}
    </>
  );
}