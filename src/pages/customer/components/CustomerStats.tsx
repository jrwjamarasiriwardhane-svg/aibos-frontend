interface CustomerStatsProps {
  activeRequests: number;
  completedServices: number;
  totalRequests: number;
}

export default function CustomerStats({
  activeRequests,
  completedServices,
  totalRequests,
}: CustomerStatsProps) {
  const stats = [
    {
      title: "Active Requests",
      value: activeRequests,
      subtitle: "Current requests",
      icon: (
        <svg
          className="h-6 w-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      iconBg: "bg-blue-50",
    },

    {
      title: "Completed Services",
      value: completedServices,
      subtitle: "Lifetime total",
      icon: (
        <svg
          className="h-6 w-6 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      iconBg: "bg-emerald-50",
    },

    {
      title: "Saved Professionals",
      value: 0,
      subtitle: "Quick access",
      icon: (
        <svg
          className="h-6 w-6 text-amber-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      ),
      iconBg: "bg-amber-50",
    },

    {
      title: "Total Requests",
      value: totalRequests,
      subtitle: "All requests",
      icon: (
        <svg
          className="h-6 w-6 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a3 3 0 006 0M9 5h6"
          />
        </svg>
      ),
      iconBg: "bg-purple-50",
    },
  ];

  return (
    <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
        >
          {/* TOP */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              {stat.title}
            </p>

            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg} ring-1 ring-slate-100 transition-transform duration-200 group-hover:scale-105`}
            >
              {stat.icon}
            </div>
          </div>

          {/* VALUE */}
          <div className="mt-5 flex items-end justify-between">
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {stat.value}
            </h3>

            <span className="text-xs font-medium text-slate-400">
              {stat.subtitle}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}