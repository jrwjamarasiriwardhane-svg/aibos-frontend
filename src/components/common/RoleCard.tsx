import {
  Zap,
  Wrench,
  Hammer,
  Paintbrush,
  Snowflake,
  Sparkles,
  Car,
  HardHat,
} from "lucide-react";

export default function RoleCards() {
  const services = [
    {
      title: "Electrician",
      description: "Electrical installation, repair and maintenance",
      icon: Zap,
    },
    {
      title: "Plumber",
      description: "Pipes, leaks, bathrooms and plumbing services",
      icon: Wrench,
    },
    {
      title: "Carpenter",
      description: "Furniture, woodwork and custom carpentry",
      icon: Hammer,
    },
    {
      title: "Painter",
      description: "Home, office and commercial painting",
      icon: Paintbrush,
    },
    {
      title: "AC Repair",
      description: "AC installation, repair and maintenance",
      icon: Snowflake,
    },
    {
      title: "Cleaning",
      description: "Home, office and professional cleaning",
      icon: Sparkles,
    },
    {
      title: "Mechanic",
      description: "Personal, business and professional drivers",
      icon: Car,
    },
    {
      title: "Construction",
      description: "Masons, workers and construction professionals",
      icon: HardHat,
    },
  ];

  return (
    <section
      id="roles"
      className="bg-slate-50 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="text-center">

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Popular Services
          </span>

          <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900">
            Find the Right Professional
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            From everyday repairs to professional business services,
            find trusted people through AIBOS.
          </p>

        </div>

        {/* Services */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {services.map((service) => {
            const Icon = service.icon;

            return (
              <button
                key={service.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
              >

                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={24} />
                </div>

                {/* Title */}
                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {service.description}
                </p>

                {/* Action */}
                <div className="mt-4 text-sm font-semibold text-blue-600">
                  Explore →
                </div>

              </button>
            );
          })}

        </div>

        {/* View all */}
        <div className="mt-10 text-center">

          <button className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-600">
            View All Services →
          </button>

        </div>

      </div>
    </section>
  );
}