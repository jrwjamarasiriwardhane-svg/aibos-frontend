import React from "react";

interface DashboardStatsProps {
  activeRequests: number;
  completedServices: number;
  savedProfessionals?: number;
  onSelectFilter?: (filterStatus: "active" | "completed" | "all") => void;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  activeRequests,
  completedServices,
  savedProfessionals = 0,
  onSelectFilter,
}) => {
  const stats = [
    {
      id: "active",
      title: "Active Requests",
      value: activeRequests,
      subtitle: "+0 this week",
      icon: "◷",
      bgClass: "bg-blue-50 text-blue-600",
      borderHover: "hover:border-blue-300",
      filterKey: "active" as const,
    },
    {
      id: "completed",
      title: "Completed Services",
      value: completedServices,
      subtitle: "Lifetime total",
      icon: "✓",
      bgClass: "bg-emerald-50 text-emerald-600",
      borderHover: "hover:border-emerald-300",
      filterKey: "completed" as const,
    },
    {
      id: "saved",
      title: "Saved Professionals",
      value: savedProfessionals,
      subtitle: "Quick access",
      icon: "♡",
      bgClass: "bg-amber-50 text-amber-600",
      borderHover: "hover:border-amber-300",
      filterKey: null,
    },
  ];

  const handleCardClick = (filterKey: "active" | "completed" | null) => {
    if (filterKey && onSelectFilter) {
      onSelectFilter(filterKey);

      // Scroll smoothly down to the CustomerRequestList section
      const requestListElem = document.getElementById("customer-requests-section");
      if (requestListElem) {
        requestListElem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.title}
          onClick={() => handleCardClick(stat.filterKey)}
          className={`group flex min-h-[130px] flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 ${
            stat.filterKey
              ? `cursor-pointer hover:-translate-y-1 hover:shadow-md ${stat.borderHover}`
              : ""
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                {stat.title}
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {stat.value}
              </p>
            </div>

            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-bold ${stat.bgClass}`}
            >
              {stat.icon}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>{stat.subtitle}</span>
            {stat.filterKey && (
              <span className="font-semibold text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                View Requests →
              </span>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default DashboardStats;