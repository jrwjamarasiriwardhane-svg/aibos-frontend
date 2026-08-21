interface Props {
  onRequestService: () => void;
  onFindProfessionals: () => void;
}

export default function CustomerQuickActions({
  onRequestService,
  onFindProfessionals,
}: Props) {
  return (
    <section className="mt-8 grid gap-5 md:grid-cols-2">

      <button
        onClick={onRequestService}
        className="group rounded-2xl bg-blue-600 p-6 text-left text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold">
              Request a Service
            </p>

            <p className="mt-1 text-sm text-blue-100">
              Tell us what service you need.
            </p>
          </div>

          <span className="text-3xl transition group-hover:scale-110">
            +
          </span>
        </div>
      </button>

      <button
        onClick={onFindProfessionals}
        className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-slate-900">
              Find Professionals
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Discover verified professionals near you.
            </p>
          </div>

          <span className="text-2xl text-blue-600 transition group-hover:translate-x-1">
            →
          </span>
        </div>
      </button>

    </section>
  );
}