export default function SocialButton() {
  return (
    <button
      type="button"
      className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-3 font-medium transition hover:bg-slate-50"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="h-5 w-5"
      />

      Continue with Google
    </button>
  );
}