import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Sparkles, User, Briefcase, Building2, ChevronDown, ShieldAlert } from "lucide-react";
import logo from "../../assets/logos/aiboslogo.png";
import LanguageSelector from "../common/LanguageSelector";

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

  const handleNavClick = (sectionId: string, defaultPath: string = "/") => {
    setMobileMenuOpen(false);
    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    navigate(`${defaultPath}#${sectionId}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="relative">
            <img
              src={logo}
              alt="AIBOS Logo"
              className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              AIBOS
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-blue-600 uppercase -mt-1">
              AI Workforce
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-8 md:flex">
          <button
            type="button"
            onClick={() => navigate("/services/search")}
            className="text-sm font-semibold text-slate-600 transition hover:text-blue-600 cursor-pointer"
          >
            {t("nav.services")}
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("features")}
            className="text-sm font-semibold text-slate-600 transition hover:text-blue-600 cursor-pointer"
          >
            {t("nav.aiMatching")}
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("stats")}
            className="text-sm font-semibold text-slate-600 transition hover:text-blue-600 cursor-pointer"
          >
            {t("nav.impact")}
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("roles")}
            className="text-sm font-semibold text-slate-600 transition hover:text-blue-600 cursor-pointer"
          >
            {t("nav.forEnterprise")}
          </button>
        </nav>

        {/* Desktop Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3 relative">
          
          {/* Language Selector Dropdown */}
          <LanguageSelector />

          {/* Sign In Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-blue-600 cursor-pointer"
            >
              <span>{t("nav.signIn")}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${loginDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {loginDropdownOpen && (
              <div
                onMouseLeave={() => setLoginDropdownOpen(false)}
                className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {t("nav.selectLoginPortal")}
                </div>
                
                <Link
                  to="/customer/login"
                  onClick={() => setLoginDropdownOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="font-bold">{t("nav.customerLogin")}</p>
                    <p className="text-[10px] text-slate-400 font-normal">{t("nav.customerDesc")}</p>
                  </div>
                </Link>

                <Link
                  to="/professional/login"
                  onClick={() => setLoginDropdownOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 transition"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <p className="font-bold">{t("nav.proLogin")}</p>
                    <p className="text-[10px] text-slate-400 font-normal">{t("nav.proDesc")}</p>
                  </div>
                </Link>

                <Link
                  to="/company/login"
                  onClick={() => setLoginDropdownOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 hover:bg-cyan-50 hover:text-cyan-600 transition"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
                    <Building2 size={16} />
                  </div>
                  <div>
                    <p className="font-bold">{t("nav.companyLogin")}</p>
                    <p className="text-[10px] text-slate-400 font-normal">{t("nav.companyDesc")}</p>
                  </div>
                </Link>

                <div className="my-1 border-t border-slate-100" />

                <Link
                  to="/admin/login"
                  onClick={() => setLoginDropdownOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                >
                  <ShieldAlert size={15} />
                  <span>{t("nav.adminAccess")}</span>
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/customer/register"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles size={16} />
            {t("nav.getStarted")}
          </Link>
        </div>

        {/* Mobile Hamburger Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSelector />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white/95 backdrop-blur-xl px-6 py-6 md:hidden animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/services/search");
              }}
              className="text-left text-base font-semibold text-slate-800 hover:text-blue-600"
            >
              {t("nav.services")}
            </button>
            <button
              onClick={() => handleNavClick("features")}
              className="text-left text-base font-semibold text-slate-800 hover:text-blue-600"
            >
              {t("nav.aiMatching")}
            </button>
            <button
              onClick={() => handleNavClick("stats")}
              className="text-left text-base font-semibold text-slate-800 hover:text-blue-600"
            >
              {t("nav.impact")}
            </button>
            
            {/* Login Links */}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t("nav.selectLoginPortal")}</span>
              <div className="grid grid-cols-3 gap-2">
                <Link
                  to="/customer/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100"
                >
                  <User size={18} className="mb-1" />
                  Customer
                </Link>
                <Link
                  to="/professional/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100"
                >
                  <Briefcase size={18} className="mb-1" />
                  Pro
                </Link>
                <Link
                  to="/company/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-cyan-50 text-cyan-700 text-xs font-semibold hover:bg-cyan-100"
                >
                  <Building2 size={18} className="mb-1" />
                  Company
                </Link>
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">New Account</span>
              <Link
                to="/customer/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
              >
                {t("nav.registerCustomer")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}