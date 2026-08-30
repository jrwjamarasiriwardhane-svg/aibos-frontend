import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Clock3,
  User,
  Bell,
  LogOut,
  X,
} from "lucide-react";

interface Props {
  activeRequests: number;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function CustomerSidebar({
  activeRequests,
  onLogout,
  isOpen = false,
  onClose,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* LOGO */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-md shadow-blue-600/30">
              A
            </div>
            <div>
              <p className="font-bold text-slate-900 leading-tight">AIBOS</p>
              <p className="text-[11px] font-semibold uppercase text-blue-600">Customer</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          <NavButton
            label="Dashboard"
            icon={<LayoutDashboard size={18} />}
            active={location.pathname === "/customer/dashboard"}
            onClick={() => handleNav("/customer/dashboard")}
          />

          <NavButton
            label="Find Professionals"
            icon={<Search size={18} />}
            active={location.pathname === "/services/search" || location.pathname === "/professionals"}
            onClick={() => handleNav("/services/search")}
          />

          <NavButton
            label="My Requests"
            icon={<Clock3 size={18} />}
            badge={activeRequests}
            active={location.pathname === "/customer/dashboard"}
            onClick={() => handleNav("/customer/dashboard")}
          />

          <NavButton
            label="Notifications"
            icon={<Bell size={18} />}
            active={location.pathname === "/customer/notifications"}
            onClick={() => handleNav("/customer/notifications")}
          />

          <NavButton
            label="My Profile"
            icon={<User size={18} />}
            active={location.pathname === "/customer/profile"}
            onClick={() => handleNav("/customer/profile")}
          />
        </nav>

        {/* BOTTOM */}
        <div className="border-t border-slate-200 p-4">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function NavButton({
  label,
  icon,
  badge,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  badge?: number;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
        active
          ? "bg-blue-50 text-blue-700 shadow-sm"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span className={active ? "text-blue-600" : "text-slate-400"}>
        {icon}
      </span>

      <span className="flex-1">{label}</span>

      {badge !== undefined && badge > 0 && (
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-600">
          {badge}
        </span>
      )}
    </button>
  );
}