import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
}

export default function AuthCard({
  children,
}: AuthCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-2xl">
      {children}
    </div>
  );
}