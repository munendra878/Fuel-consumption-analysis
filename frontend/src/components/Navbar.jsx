import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const neonHover = {
    scale: 1.05,
    boxShadow:
      "0 0 20px 2px rgba(99, 102, 241, 0.7), 0 0 40px 5px rgba(210, 114, 24, 0.5)",
  };

  return (
    <nav className="fixed top-4 left-0 right-0 mx-auto z-50 max-w-7xl px-6 md:px-12">
      <div className="flex items-center justify-between backdrop-blur-md bg-black/40 border border-slate-700 rounded-full px-6 py-4 transition-all shadow-lg">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10 w-10" />
          <span className="font-bold text-lg md:text-xl text-white tracking-wide">
            Fuel Consumption Analysis
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-6 ml-10">
          {["Home", "About", "Feedback", "Blogs", "Developer", "Privacy"].map(
            (link, i) => (
              <Link
                key={i}
                to={`/${link.toLowerCase()}`}
                className={`relative text-white hover:text-indigo-400 transition font-medium ${
                  location.pathname === `/${link.toLowerCase()}` ? "text-indigo-400" : ""
                }`}
              >
                {link}
              </Link>
            )
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="hidden md:flex items-center gap-4 ml-12">
          {/* Theme Toggle */}
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            whileHover={{ scale: 1.1 }}
            className="p-2 rounded-full hover:bg-slate-800 transition text-xl"
            title="Toggle Theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </motion.button>

          {/* Signed Out */}
          <SignedOut>
            <motion.div whileHover={neonHover}>
              <Link
                to="/login"
                className="bg-white border border-indigo-500 px-4 py-2 rounded-full text-indigo-400 font-medium transition"
              >
                Login
              </Link>
            </motion.div>

            <motion.div whileHover={neonHover}>
              <Link
                to="/register"
                className="bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 rounded-full text-white font-bold shadow-lg transition"
              >
                Get Started
              </Link>
            </motion.div>
          </SignedOut>

          {/* Signed In */}
          <SignedIn>
            <motion.div whileHover={neonHover}>
              <Link
                to="/dashboard"
                className="border border-emerald-400 px-4 py-2 rounded-full text-emerald-400 font-medium transition"
              >
                Dashboard
              </Link>
            </motion.div>

            <SignOutButton>
              <motion.button
                whileHover={neonHover}
                className="bg-gradient-to-r from-emerald-400 to-lime-400 px-4 py-2 rounded-full text-black font-bold shadow-lg transition"
              >
                Logout
              </motion.button>
            </SignOutButton>
          </SignedIn>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-3xl p-2 hover:bg-slate-800 rounded-full transition"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="md:hidden absolute left-0 right-0 mt-2 bg-black/90 backdrop-blur rounded-xl flex flex-col items-center gap-4 py-6 mx-4 shadow-lg z-40"
          >
            {["Home", "About", "Feedback", "Blogs", "Developer", "Privacy"].map(
              (link, i) => (
                <Link
                  key={i}
                  to={`/${link.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-white text-lg w-full text-center py-2 rounded-lg hover:bg-indigo-600 transition"
                >
                  {link}
                </Link>
              )
            )}

            {/* MOBILE ACTIONS */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="border px-4 py-2 rounded-full w-3/4 text-center hover:bg-slate-800 transition"
            >
              {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
            </button>

            <SignedOut>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="border px-4 py-2 rounded-full w-3/4 text-center hover:bg-slate-800 transition"
              >
                Login
              </Link>
            </SignedOut>

            <SignedIn>
              <SignOutButton>
                <button className="bg-gradient-to-r from-emerald-400 to-lime-400 px-4 py-2 rounded-full w-3/4 text-black font-bold hover:scale-105 transition">
                  Logout
                </button>
              </SignOutButton>
            </SignedIn>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
