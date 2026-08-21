import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden rounded-[32px] bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-20 text-center text-white shadow-2xl">

          <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
            🚀 Join the Future of Workforce Management
          </span>

          <h2 className="mx-auto mt-8 max-w-3xl text-5xl font-extrabold leading-tight">
            One Platform.
            <br />
            Endless Opportunities.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            Whether you're looking for trusted professionals,
            searching for jobs, or managing an entire business,
            AIBOS gives you everything in one intelligent platform.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-5">

            <Link
              to="/customer/register"
              className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 transition hover:scale-105"
            >
              Customer
            </Link>

            <Link
              to="/professional/register"
              className="rounded-xl border border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-blue-700"
            >
              Professional
            </Link>

            <Link
              to="/company/register"
              className="rounded-xl border border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-blue-700"
            >
              Company
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}