interface Props {
  user: any;
}

export default function DashboardHero({
  user,
}: Props) {
  const firstName =
    user.fullName?.split(" ")[0] || "Customer";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl sm:p-10">

      <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-blue-600/30 blur-3xl" />

      <div className="absolute -bottom-10 right-20 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="relative z-10 max-w-2xl">

        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 ring-1 ring-inset ring-blue-500/20">

          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />

          Customer Dashboard

        </span>

        <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-4xl">
          Welcome back, {firstName} 👋
        </h2>

        <p className="mt-2 text-sm text-slate-300 sm:text-base">
          Find verified professionals, create service
          requests, and track your services from one
          workspace.
        </p>

      </div>

    </div>
  );
}