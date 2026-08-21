import type { ReactNode } from "react";

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
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Side */}
        <div
          className={`hidden lg:flex flex-col justify-center bg-gradient-to-br ${color} px-16 py-12 text-white`}
        >
          <h1 className="text-5xl font-bold">{title}</h1>

          <p className="mt-6 text-lg text-blue-100">{subtitle}</p>

          <div className="my-10 flex justify-center">
            <img
              src={illustration}
              alt="Illustration"
              className="max-h-[350px] w-auto object-contain"
            />
          </div>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl bg-white/10 p-4"
              >
                <div className="h-2 w-2 rounded-full bg-white"></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-lg rounded-3xl bg-white p-10 shadow-2xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}