import { useNavigate } from "react-router-dom";

interface Props {
  activeRequests: number;
  onLogout: () => void;
}

export default function CustomerSidebar({
  activeRequests,
  onLogout,
}: Props) {
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">

      {/* LOGO */}

      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
          A
        </div>

        <div>
          <p className="font-bold text-slate-900">
            AIBOS
          </p>

          <p className="text-xs text-slate-500">
            Customer Workspace
          </p>
        </div>

      </div>

      {/* NAV */}

      <nav className="flex-1 space-y-2 p-4">

        <NavButton
          label="Dashboard"
          icon="▣"
          onClick={() =>
            navigate("/customer/dashboard")
          }
        />

        <NavButton
          label="Find Professionals"
          icon="⌕"
          onClick={() =>
            navigate("/professionals")
          }
        />

        <NavButton
          label="My Requests"
          icon="◷"
          badge={activeRequests}
          onClick={() =>
            navigate("/customer/dashboard")
          }
        />

        <NavButton
          label="Saved Professionals"
          icon="☆"
          onClick={() => {}}
        />

        <NavButton
          label="Messages"
          icon="□"
          onClick={() => {}}
        />

      </nav>

      {/* BOTTOM */}

      <div className="border-t border-slate-200 p-4">

        <NavButton
          label="Settings"
          icon="⚙"
          onClick={() => {}}
        />

        <button
          onClick={onLogout}
          className="mt-2 w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          ↪ Logout
        </button>

      </div>

    </aside>
  );
}

function NavButton({
  label,
  icon,
  badge,
  onClick,
}: {
  label: string;
  icon: string;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
    >
      <span className="w-5 text-center text-lg">
        {icon}
      </span>

      <span className="flex-1">{label}</span>

      {badge !== undefined && badge > 0 && (
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
          {badge}
        </span>
      )}
    </button>
  );
}