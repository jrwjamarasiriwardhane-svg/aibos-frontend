import { useNavigate } from "react-router-dom";

interface Props {
  user: any;
}

export default function CustomerHeader({
  user,
}: Props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/customer/login");
  };

  // Get first letter for fallback avatar
  const firstLetter =
    user?.fullName?.charAt(0)?.toUpperCase() || "C";

  // Profile image URL
  const profileImage = user?.profileImage
    ? user.profileImage
    : user?.id
    ? `http://localhost:5000/api/users/profile-image/${user.id}`
    : "";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ============================= */}
        {/* LEFT - AIBOS */}
        {/* ============================= */}

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-md shadow-blue-500/20">
            A
          </div>

          <div>
            <h1 className="text-base font-bold leading-none tracking-tight text-slate-900 sm:text-lg">
              AIBOS
            </h1>

            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Customer Workspace
            </p>
          </div>

        </div>

        {/* ============================= */}
        {/* RIGHT */}
        {/* ============================= */}

        <div className="flex items-center gap-4">

          {/* ============================= */}
          {/* NOTIFICATION */}
          {/* ============================= */}

          <button
            type="button"
            onClick={() =>
              navigate("/customer/notifications")
            }
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"
            title="Notifications"
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>

            {/* notification dot */}
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600" />
          </button>

          {/* divider */}

          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          {/* ============================= */}
          {/* USER INFO + PROFILE */}
          {/* ============================= */}

          <button
            type="button"
            onClick={() => navigate("/customer/profile")}
            className="group flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
            title="Open Profile"
          >

            {/* NAME */}

            <div className="hidden text-right sm:block">

              <p className="text-sm font-semibold text-slate-900 transition group-hover:text-blue-600">
                {user?.fullName || "Customer"}
              </p>

              <p className="text-xs font-medium capitalize text-slate-500">
                {user?.role || "Customer"}
              </p>

            </div>

            {/* PROFILE AVATAR */}

            {profileImage ? (
              <img
                src={profileImage}
                alt={user?.fullName || "Customer"}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-transparent transition group-hover:ring-blue-200"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden"
                  );
                }}
              />
            ) : null}

            {/* FALLBACK LETTER */}

            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 ring-2 ring-transparent transition group-hover:bg-blue-200 group-hover:ring-blue-200 ${
                profileImage ? "hidden" : ""
              }`}
            >
              {firstLetter}
            </div>

          </button>

          {/* ============================= */}
          {/* LOGOUT */}
          {/* ============================= */}

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
  );
}