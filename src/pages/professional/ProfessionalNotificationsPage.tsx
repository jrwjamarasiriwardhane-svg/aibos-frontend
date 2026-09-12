import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  Clock,
  Briefcase,
  DollarSign,
  Zap,
  Loader2,
} from "lucide-react";

interface NotificationItem {
  _id: string;
  type?: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";

export default function ProfessionalNotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const token = localStorage.getItem("token") || "";

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.warn("Professional notifications fetch fallback:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, [token]);

  const markAllRead = async () => {
    try {
      await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  };

  const markSingleRead = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    return true;
  });

  const getIcon = (type?: string) => {
    switch (type) {
      case "QUOTATION_ACCEPTED":
      case "PAYMENT_RECEIVED":
        return <DollarSign size={16} className="text-emerald-600" />;
      case "NEW_SERVICE_REQUEST":
      case "JOB_RECOMMENDED":
        return <Briefcase size={16} className="text-blue-600" />;
      case "AI_ALERT":
      case "PROFESSIONAL_NEARBY":
        return <Zap size={16} className="text-cyan-600" />;
      default:
        return <Bell size={16} className="text-slate-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xl font-extrabold text-slate-900 tracking-tight">
              AIBOS
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-bold text-slate-700">Specialist Notifications</span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/professional/dashboard")}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Notification Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time dispatch alerts, quotation updates, and payment notices
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-slate-200/70 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-lg transition ${
                  filter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter("unread")}
                className={`px-3 py-1 rounded-lg transition ${
                  filter === "unread" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"
                }`}
              >
                Unread
              </button>
            </div>

            <button
              type="button"
              onClick={markAllRead}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <CheckCheck size={14} />
              <span>Mark All Read</span>
            </button>
          </div>
        </div>

        {/* Notifications list */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 size={28} className="animate-spin text-blue-600" />
            <p className="text-xs">Loading notifications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Bell size={22} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">All Caught Up</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You have no {filter === "unread" ? "unread" : ""} notifications right now.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item._id}
                onClick={() => markSingleRead(item._id)}
                className={`flex items-start gap-3.5 p-4 rounded-2xl border transition cursor-pointer ${
                  !item.isRead
                    ? "bg-blue-50/40 border-blue-200 shadow-xs"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="h-9 w-9 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1 font-mono">
                      <Clock size={10} />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                </div>

                {!item.isRead && (
                  <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
