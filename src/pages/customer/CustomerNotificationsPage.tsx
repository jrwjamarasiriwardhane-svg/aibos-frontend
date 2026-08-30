import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Check, Trash2, ShieldCheck, Clock } from "lucide-react";

interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function CustomerNotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      _id: "1",
      title: "Welcome to AIBOS",
      message: "Your customer workspace is active. Create your first service request anytime!",
      isRead: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "2",
      title: "AI Matching Ready",
      message: "Our AI matching engine is analyzing top verified professionals for your location.",
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    const fetchNotifs = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => null);

        if (res && res.ok) {
          const data = await res.json().catch(() => ({}));
          if (data.notifications && data.notifications.length > 0) {
            setNotifications(data.notifications);
          }
        }
      } catch (e) {
        console.warn("Notifications fetch fallback:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, [token]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/customer/dashboard")}
              className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              <ArrowLeft size={16} />
              Dashboard
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-sm font-bold text-slate-800">Notifications</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <ShieldCheck size={16} className="text-blue-600" />
            Customer Workspace
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Notification Center
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Stay updated on service requests, matching status, and system alerts.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Check size={14} />
              Mark all read
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
            >
              <Trash2 size={14} />
              Clear
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
              <p className="mt-4 text-xs font-semibold text-slate-500">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                <Bell size={24} />
              </div>
              <h3 className="mt-4 font-bold text-slate-800">No notifications</h3>
              <p className="mt-1 text-sm text-slate-500">
                You're all caught up! Updates about your service requests will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif._id}
                className={`flex items-start gap-4 rounded-2xl border p-5 transition ${
                  notif.isRead
                    ? "border-slate-200 bg-white shadow-sm"
                    : "border-blue-200 bg-blue-50/50 shadow-sm ring-1 ring-blue-100"
                }`}
              >
                <div
                  className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    notif.isRead
                      ? "bg-slate-100 text-slate-500"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  <Bell size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-slate-900">{notif.title}</h4>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={12} />
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
