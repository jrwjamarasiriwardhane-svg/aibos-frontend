import { useEffect, useRef, useState } from "react";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedRequest?: {
    _id: string;
  };
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // ==========================================
  // TOKEN
  // ==========================================

  const token = localStorage.getItem("token");

  // ==========================================
  // GET NOTIFICATIONS
  // ==========================================

  const loadNotifications = async () => {
    if (!token) {
      console.log("No authentication token found");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/notifications",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("NOTIFICATION RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load notifications"
        );
      }

      setNotifications(
        data.notifications || data.data || []
      );
    } catch (error) {
      console.error(
        "LOAD NOTIFICATIONS ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // BELL CLICK
  // ==========================================

  const handleBellClick = () => {
    const newState = !open;

    setOpen(newState);

    if (newState) {
      loadNotifications();
    }
  };

  // ==========================================
  // CLOSE WHEN CLICKING OUTSIDE
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ==========================================
  // UNREAD COUNT
  // ==========================================

  const unreadCount = notifications.filter(
    (notification) =>
      !notification.isRead
  ).length;

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleString();
    } catch {
      return "";
    }
  };

  // ==========================================
  // CLICK NOTIFICATION
  // ==========================================

  const handleNotificationClick = (
    notification: Notification
  ) => {
    console.log(
      "Notification clicked:",
      notification
    );

    if (
      notification.relatedRequest?._id
    ) {
      window.location.href =
        `/customer/request/${notification.relatedRequest._id}`;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >

      {/* ====================================== */}
      {/* BELL BUTTON */}
      {/* ====================================== */}

      <button
        type="button"
        onClick={handleBellClick}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-blue-600 active:scale-95"
        title="Notifications"
      >

        {/* BELL ICON */}

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

        {/* ================================= */}
        {/* UNREAD BADGE */}
        {/* ================================= */}

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9
              ? "9+"
              : unreadCount}
          </span>
        )}

      </button>

      {/* ====================================== */}
      {/* NOTIFICATION DROPDOWN */}
      {/* ====================================== */}

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

          {/* HEADER */}

          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Notifications
              </h3>

              <p className="text-xs text-slate-500">
                Your latest updates
              </p>
            </div>

            {unreadCount > 0 && (
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600">
                {unreadCount} unread
              </span>
            )}

          </div>

          {/* ================================= */}
          {/* LOADING */}
          {/* ================================= */}

          {loading && (
            <div className="px-4 py-8 text-center">

              <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

              <p className="mt-2 text-xs text-slate-500">
                Loading notifications...
              </p>

            </div>
          )}

          {/* ================================= */}
          {/* EMPTY */}
          {/* ================================= */}

          {!loading &&
            notifications.length === 0 && (
              <div className="px-4 py-10 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">

                  <svg
                    className="h-6 w-6 text-slate-400"
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

                </div>

                <p className="mt-3 text-sm font-semibold text-slate-700">
                  No notifications
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  You're all caught up.
                </p>

              </div>
            )}

          {/* ================================= */}
          {/* NOTIFICATIONS */}
          {/* ================================= */}

          {!loading &&
            notifications.length > 0 && (
              <div className="max-h-96 overflow-y-auto">

                {notifications.map(
                  (notification) => (
                    <button
                      key={notification._id}
                      type="button"
                      onClick={() =>
                        handleNotificationClick(
                          notification
                        )
                      }
                      className={`w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 ${
                        !notification.isRead
                          ? "bg-blue-50/50"
                          : "bg-white"
                      }`}
                    >

                      <div className="flex gap-3">

                        {/* STATUS DOT */}

                        <div className="mt-1.5">
                          <span
                            className={`block h-2.5 w-2.5 rounded-full ${
                              notification.isRead
                                ? "bg-slate-300"
                                : "bg-blue-600"
                            }`}
                          />
                        </div>

                        {/* CONTENT */}

                        <div className="min-w-0 flex-1">

                          <p className="text-sm font-semibold text-slate-900">
                            {notification.title}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {notification.message}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-400">
                            {formatDate(
                              notification.createdAt
                            )}
                          </p>

                        </div>

                      </div>

                    </button>
                  )
                )}

              </div>
            )}

          {/* ================================= */}
          {/* FOOTER */}
          {/* ================================= */}

          <div className="border-t border-slate-100 px-4 py-3">

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                window.location.href =
                  "/customer/notifications";
              }}
              className="w-full rounded-lg py-2 text-center text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              View all notifications
            </button>

          </div>

        </div>
      )}

    </div>
  );
}