import { Link } from "react-router-dom";
import logo from "../../assets/logos/aiboslogo.png";



export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
  <img
    src={logo}
    alt="AIBOS Logo"
    className="h-11 w-auto object-contain"
  />

          <span className="text-2xl font-bold tracking-tight text-slate-900">
            AIBOS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="font-medium text-slate-600 transition hover:text-blue-600"
          >
            Features
          </a>

          <a
            href="#roles"
            className="font-medium text-slate-600 transition hover:text-blue-600"
          >
            Services
          </a>

          <a
            href="#about"
            className="font-medium text-slate-600 transition hover:text-blue-600"
          >
            About
          </a>

          <a
            href="#contact"
            className="font-medium text-slate-600 transition hover:text-blue-600"
          >
            Contact
          </a>
        </nav>

        {/* Right Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/customer/login"
            className="rounded-lg px-5 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Login
          </Link>

          <Link
            to="/customer/register"
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}