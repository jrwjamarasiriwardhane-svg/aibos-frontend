import {
  Users,
  Building2,
  BriefcaseBusiness,
  Star,
} from "lucide-react";

const stats = [
  {
    icon: Users,
    number: "10K+",
    label: "Active Users",
  },
  {
    icon: Building2,
    number: "2K+",
    label: "Registered Companies",
  },
  {
    icon: BriefcaseBusiness,
    number: "50K+",
    label: "Completed Jobs",
  },
  {
    icon: Star,
    number: "4.9",
    label: "Average Rating",
  },
];

export default function Stats() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900">
            Trusted by Thousands
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Growing every day with customers, professionals,
            and businesses across multiple industries.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <Icon size={30} />
                </div>

                <h3 className="mt-6 text-4xl font-extrabold text-slate-900">
                  {item.number}
                </h3>

                <p className="mt-2 text-slate-600">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}