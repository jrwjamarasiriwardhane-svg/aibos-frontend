import type { Notification } from "../../types/Notification";
import NotificationItem from "./NotificationItem";

interface Props {
  notifications: Notification[];
  onRead: (notification: Notification) => void;
  onMarkAllRead: () => void;
  onViewAll: () => void;
}

export default function NotificationDropdown({
  notifications,
  onRead,
  onMarkAllRead,
  onViewAll,
}: Props) {
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div className="absolute right-0 top-12 z-50 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">

        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Notifications
          </h3>

          <p className="text-xs text-slate-400">
            {unreadCount} unread
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Mark all read
          </button>
        )}

      </div>

      <div className="max-h-[400px] overflow-y-auto">

        {notifications.length === 0 ? (
          <div className="px-6 py-10 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              🔔
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-700">
              No notifications
            </p>

            <p className="mt-1 text-xs text-slate-400">
              You're all caught up.
            </p>

          </div>
        ) : (
          notifications
            .slice(0, 10)
            .map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onRead={onRead}
              />
            ))
        )}

      </div>

      {notifications.length > 0 && (
        <button
          type="button"
          onClick={onViewAll}
          className="w-full border-t border-slate-100 px-4 py-3 text-center text-xs font-bold text-blue-600 hover:bg-slate-50"
        >
          View all notifications
        </button>
      )}

    </div>
  );
}