import {
  Brain,
  ShieldCheck,
  BarChart3,
  Bell,
  BadgeCheck,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Smart Matching",
    description:
      "Our AI intelligently connects customers with the most suitable professionals based on skills, ratings, and availability.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Platform",
    description:
      "Enterprise-grade authentication and data protection keep every user and business safe.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Professionals",
    description:
      "Every professional can be verified to improve trust and service quality.",
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    description:
      "Companies receive real-time dashboards with workforce performance and insights.",
  },
  {
    icon: Bell,
    title: "Real-Time Notifications",
    description:
      "Receive instant updates for bookings, approvals, job requests, and important events.",
  },
  {
    icon: Zap,
    title: "Fast & Scalable",
    description:
      "Built with modern technologies to deliver a fast, responsive, and scalable experience.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="bg-slate-50 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Platform Features
          </span>

          <h2 className="mt-5 text-4xl font-bold text-slate-900">
            Why Choose AIBOS?
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-600">
            Everything you need to connect people, manage businesses,
            and automate workforce operations with Artificial Intelligence.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}