import { useNavigate } from "react-router-dom";

export default function FindProfessionalBanner() {
  const navigate = useNavigate();

  return (
    <div className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg sm:p-8">

      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">

        <div className="max-w-xl">

          <h3 className="text-xl font-bold sm:text-2xl">
            Need a professional right now?
          </h3>

          <p className="mt-2 text-sm text-blue-100 sm:text-base">
            Tell AIBOS what service you need and find
            professionals based on skills, location,
            experience, availability and ratings.
          </p>

        </div>

        <button
          onClick={() => navigate("/professionals")}
          className="rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-600 shadow-md transition hover:bg-blue-50 active:scale-95"
        >
          Find Professionals →
        </button>

      </div>

    </div>
  );
}