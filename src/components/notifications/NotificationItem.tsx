import type { Notification } from "../../types/Notification";

interface Props {
  notification: Notification;
  onRead: (notification: Notification) => void;
}

export default function NotificationItem({
  notification,
  onRead,
}: Props) {
  // ==========================================
  // ICON
  // ==========================================

  const getIcon = () => {
    switch (notification.type) {
      case "NEW_SERVICE_REQUEST":
        return "🔔";

      case "REQUEST_ACCEPTED":
        return "✓";

      case "REQUEST_REJECTED":
        return "×";

      case "REQUEST_CANCELLED":
        return "×";

      case "SERVICE_STARTED":
        return "▶";

      case "SERVICE_COMPLETED":
        return "✓";

      case "SYSTEM":
        return "ℹ";

      default:
        return "ℹ";
    }
  };

  // ==========================================
  // ICON STYLE
  // ==========================================

  const getIconStyle = () => {
    switch (notification.type) {
      case "REQUEST_ACCEPTED":
      case "SERVICE_COMPLETED":
        return "bg-green-100 text-green-600";

      case "REQUEST_REJECTED":
      case "REQUEST_CANCELLED":
        return "bg-red-100 text-red-600";

      case "SERVICE_STARTED":
        return "bg-blue-100 text-blue-600";

      case "NEW_SERVICE_REQUEST":
        return "bg-indigo-100 text-indigo-600";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  // ==========================================
  // CLICK
  // ==========================================

  const handleClick = () => {
    if (!notification.isRead) {
      onRead(notification);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50 ${
        !notification.isRead
          ? "bg-blue-50/40"
          : "bg-white"
      }`}
    >
      <div className="flex gap-3">

        {/* ICON */}

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${getIconStyle()}`}
        >
          {getIcon()}
        </div>

        {/* CONTENT */}

        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-2">

            <h3
              className={`text-sm ${
                notification.isRead
                  ? "font-medium text-slate-700"
                  : "font-bold text-slate-900"
              }`}
            >
              {notification.title}
            </h3>

            {!notification.isRead && (
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
            )}

          </div>

          <p className="mt-1 text-sm leading-5 text-slate-500">
            {notification.message}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            {formatDate(notification.createdAt)}
          </p>

        </div>
      </div>
    </button>
  );
}