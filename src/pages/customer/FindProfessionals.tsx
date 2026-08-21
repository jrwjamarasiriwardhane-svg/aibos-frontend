import { useNavigate } from "react-router-dom";

export default function FindProfessionals() {
  const navigate = useNavigate();

  const categories = [
    "Electrical",
    "AC & Cooling",
    "Plumbing",
    "Carpentry",
    "Masonry",
    "Painting",
    "Appliance Repair",
    "Cleaning",
    "Gardening",
    "IT Support",
  ];

  const handleCategoryClick = (category: string) => {
    navigate(
      `/services/search?category=${encodeURIComponent(category)}`
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              AIBOS
            </h1>

            <p className="text-xs text-slate-500">
              Find Professionals
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/customer/dashboard")
            }
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Dashboard
          </button>

        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* INTRO */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            FIND PROFESSIONALS
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            What service do you need?
          </h2>

          <p className="mt-2 max-w-2xl text-slate-500">
            Choose a service category and find verified
            professionals who can help you.
          </p>
        </div>

        {/* CATEGORIES */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() =>
                handleCategoryClick(category)
              }
              className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg"
            >

              <h3 className="text-lg font-semibold text-slate-900">
                {category}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Find verified{" "}
                {category.toLowerCase()} professionals
              </p>

              <div className="mt-5 flex items-center justify-between">

                <span className="text-sm font-semibold text-blue-600">
                  View professionals
                </span>

                <span className="text-lg text-blue-600 transition-transform group-hover:translate-x-1">
                  →
                </span>

              </div>

            </button>
          ))}

        </div>

      </main>
    </div>
  );
}