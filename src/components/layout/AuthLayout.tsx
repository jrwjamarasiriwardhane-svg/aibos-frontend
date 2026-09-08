import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  illustration: string;
  features: string[];
  children: ReactNode;
  color?: string;
}

export default function AuthLayout(props: AuthLayoutProps) {
  const {
    title,
    subtitle,
    illustration,
    features,
    children,
    color = "from-blue-700 via-blue-600 to-cyan-500",
  } = props;

  return (
    <div className="min-h-screen bg-[#060913]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Side */}
        <div
          className={`hidden lg:flex flex-col justify-center bg-gradient-to-br ${color} px-12 xl:px-16 py-12 text-white`}
        >
          <div className="mb-8">
            <Link to="/" className="text-2xl font-extrabold tracking-tight text-white hover:opacity-90 transition">
              AIBOS
            </Link>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold">{title}</h1>

          <p className="mt-6 text-base xl:text-lg text-blue-100">{subtitle}</p>

          <div className="my-10 flex justify-center">
            <img
              src={illustration}
              alt="Illustration"
              className="max-h-[320px] w-auto object-contain"
            />
          </div>

          <div className="space-y-3.5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl bg-white/10 p-3.5"
              >
                <div className="h-2 w-2 rounded-full bg-white"></div>
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-10 shadow-2xl">
            <div className="mb-6 flex justify-center lg:hidden">
              <Link to="/" className="text-2xl font-extrabold tracking-tight text-slate-900 hover:text-blue-600 transition-colors">
                AIBOS
              </Link>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}