interface PrimaryButtonProps {
  text: string;
}

export default function PrimaryButton({
  text,
}: PrimaryButtonProps) {
  return (
    <button
      type="submit"
      className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {text}
    </button>
  );
}