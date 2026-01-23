import { useLocation, Link } from "react-router-dom";
import {
  InformationCircleIcon,
  PhoneIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  UserIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { Github, Linkedin, Briefcase } from "lucide-react";

function Footer() {
  const location = useLocation();

  // Hide footer on auth pages
  if (
    location.pathname === "/login" ||
    location.pathname === "/register"
  ) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* ===== APP INFO ===== */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Fuel Consumption Analysis
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Smart automobile fuel efficiency analysis using AI & data analytics.
            Helping reduce fuel costs and carbon emissions.
          </p>
        </div>

        {/* ===== QUICK LINKS ===== */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-3 text-sm">

            <li className="flex items-center gap-2">
              <InformationCircleIcon className="w-5 h-5 text-emerald-400" />
              <Link to="/about" className="hover:text-emerald-400 transition">
                About
              </Link>
            </li>

            <li className="flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5 text-emerald-400" />
              <Link to="/blogs" className="hover:text-emerald-400 transition">
                Blogs
              </Link>
            </li>

            <li className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-emerald-400" />
              <Link to="/developer" className="hover:text-emerald-400 transition">
                Developer
              </Link>
            </li>

            <li className="flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
              <Link to="/privacy" className="hover:text-emerald-400 transition">
                Privacy Policy
              </Link>
            </li>

          </ul>
        </div>

        {/* ===== CONTACT INFO ===== */}
        <div>
          <h4 className="text-white font-semibold mb-4">Get in Touch</h4>

          <p className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <EnvelopeIcon className="w-5 h-5 text-emerald-400" />
            info@fuelanalysis.com
          </p>

          <p className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <PhoneIcon className="w-5 h-5 text-emerald-400" />
            +91 8000819488
          </p>

          <p className="text-gray-400 text-sm">
            🌐 www.fuelanalysis.com
          </p>
        </div>

      </div>

      {/* ===== SOCIAL LINKS ===== */}
      <div className="flex justify-center items-center gap-6 py-5 border-t border-gray-700">
      <a
  href="https://portfolio-munendra.infinityfree.me/"
  target="_blank"
  rel="noreferrer"
  title="My Portfolio"
  className="p-3 rounded-full bg-black/40 hover:bg-indigo-600 transition"
>
  <Briefcase />
</a>

              <a
               href="https://github.com/munendra878/"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-full bg-black/40 hover:bg-indigo-600 transition"
              >
                <Github />
              </a>
              <a
                href="https://linkedin.com/in/munendrasinh-radheshyam-baghel-707946361/"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-full bg-black/40 hover:bg-indigo-600 transition"
              >
                <Linkedin />
              </a>
      </div>

      {/* ===== COPYRIGHT ===== */}
      <div className="text-center text-gray-400 text-sm bg-gray-800 py-4 border-t border-gray-700">
        © {new Date().getFullYear()} Fuel Consumption Analysis System. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
