import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">

          {/* Company */}
          <div className="lg:col-span-2">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                A
              </div>

              <h2 className="text-3xl font-bold text-white">
                AIBOS
              </h2>

            </div>

            <p className="mt-6 leading-8 text-slate-400">
              AI Business Operating System designed to connect customers,
              professionals and companies through intelligent workforce
              management and AI-powered automation.
            </p>

            <div className="mt-8 flex gap-4">

              <a
                href="#"
                className="rounded-xl bg-slate-800 p-3 transition hover:bg-blue-600"
              >
                <FaFacebook size={20} />
              </a>

              <a
                href="#"
                className="rounded-xl bg-slate-800 p-3 transition hover:bg-blue-600"
              >
                <FaLinkedin size={20} />
              </a>

              <a
                href="#"
                className="rounded-xl bg-slate-800 p-3 transition hover:bg-blue-600"
              >
                <FaGithub size={20} />
              </a>

            </div>
          </div>

          {/* Platform */}

          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Platform
            </h3>

            <ul className="space-y-4">

              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Services</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>

            </ul>
          </div>

          {/* Company */}

          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Company
            </h3>

            <ul className="space-y-4">

              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>

            </ul>
          </div>

          {/* Contact */}

          <div>

            <h3 className="mb-5 text-lg font-semibold text-white">
              Contact
            </h3>

            <div className="space-y-5">

              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span>support@aibos.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} />
                <span>+94 77 123 4567</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} />
                <span>
                  Colombo,
                  <br />
                  Sri Lanka
                </span>
              </div>

            </div>

          </div>

        </div>

        <div className="mt-16 border-t border-slate-800 pt-8">

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">

            <p className="text-slate-500">
              © 2026 AIBOS. All Rights Reserved.
            </p>

            <div className="flex gap-8 text-slate-500">

              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>

              <a href="#" className="hover:text-white">
                Terms of Service
              </a>

              <a href="#" className="hover:text-white">
                Cookies
              </a>

            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}