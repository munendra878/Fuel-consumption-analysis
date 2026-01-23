import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignedOut, SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";

function Home() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState([
    { label: "Total Visitors", value: 789 },
    { label: "Vehicles Analyzed", value: 532 },
    { label: "Fuel Saved (L)", value: 2280 },
  ]);

  /* ------------------ THEME ------------------ */
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  /* ------------------ FEEDBACKS ------------------ */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("feedbacks")) || [];
    setFeedbacks(saved);
  }, []);

  /* ------------------ STATS ANIMATION ------------------ */
  useEffect(() => {
    stats.forEach((s, index) => {
      let start = 0;
      const end = s.value;
      const duration = 1500;
      const stepTime = Math.abs(Math.floor(duration / end));
      const timer = setInterval(() => {
        start += 1;
        setStats((prev) => {
          const copy = [...prev];
          copy[index].value = start;
          return copy;
        });
        if (start >= end) clearInterval(timer);
      }, stepTime);
    });
  }, []);

  return (
    <section className="relative text-white dark:bg-gray-900 transition-colors">

      {/* ===== HERO BACKGROUND ANIMATED PARTICLES ===== */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-indigo-500/60 dark:bg-indigo-400/40"
            animate={{
              x: [Math.random() * 2000 - 1000, Math.random() * 2000 - 1000],
              y: [Math.random() * 800 - 400, Math.random() * 800 - 400],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "mirror",
            }}
            style={{
              top: Math.random() * 800,
              left: Math.random() * 2000 - 500,
            }}
          />
        ))}
      </div>
{/* ===== HERO ===== */}
<div className="relative flex flex-col items-center text-center px-6 pt-32 z-10">

  {/* Animated Glow Behind Hero Text */}
  <div className="absolute -z-10 w-96 h-96 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-3xl animate-pulse" />
  <div className="absolute -z-10 w-72 h-72 rounded-full bg-gradient-to-r from-emerald-400 via-lime-400 to-yellow-300 opacity-20 blur-2xl animate-pulse" />
<div className="background-color: #16c370;"/>
  <h1 className="text-5xl md:text-6xl font-bold max-w-3xl relative z-10">
    Fuel Consumption Analysis System
  </h1>
  <p className="max-w-xl mt-4 text-gray-300 relative z-10">
    Analyze automobile fuel efficiency using <b>AI & Data Analytics</b>
  </p>

  <div className="flex gap-6 mt-10 relative z-10">
    <div
      onClick={() =>
        document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
      }
      className="shine-border rounded-full p-[2px] hover:scale-105 transition cursor-pointer"
    >
      <button className="px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/40 transition">
        Get Started →
      </button>
    </div>

    <button
      onClick={() => navigate("/login")}
      className="bg-white text-black px-7 py-3 rounded-full font-medium
                 shadow-[0_0_40px_10px] shadow-white/30 hover:scale-105 transition"
    >
      Login
    </button>
  </div>
</div>


      {/* ===== FEATURES ===== */}
      <div id="features" className="max-w-6xl mx-auto mt-32 px-6 mb-32">
        <h2 className="text-4xl font-extrabold text-center mb-4 text-gray-900 dark:text-white">
          Powerful Features
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-14">
          Smart tools to analyze fuel efficiency and reduce emissions
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "🚗", title: "Vehicle Analysis", desc: "Compare engine size, cylinders, fuel type, and efficiency across vehicles.", gradient:"from-blue-400/80 to-blue-200/80 dark:from-blue-900 dark:to-blue-700"},
            { icon: "📊", title: "AI Predictions", desc: "Predict fuel consumption and emissions using intelligent ML models.", gradient:"from-green-400/80 to-green-200/80 dark:from-green-900 dark:to-green-700"},
            { icon: "🌱", title: "Eco Friendly", desc: "Optimize fuel usage, reduce carbon footprint, and save money.", gradient:"from-emerald-400/80 to-emerald-200/80 dark:from-emerald-900 dark:to-emerald-700"},
            { icon: "🤖", title: "AI ChatBot", desc: "Get instant assistance and insights with our AI-powered chatbot.", gradient:"from-emerald-400/80 to-emerald-200/80 dark:from-emerald-900 dark:to-emerald-700"},
            { icon: "📊", title: "CO₂ Emissions", desc: "Track and analyze CO₂ emissions for a greener future.", gradient:"from-green-400/80 to-green-200/80 dark:from-green-900 dark:to-green-700"},
            { icon: "📁", title: "Upload Dataset", desc: "Easily upload vehicle datasets and perform comprehensive fuel efficiency analysis.", gradient:"from-blue-400/80 to-blue-200/80 dark:from-blue-900 dark:to-blue-700"},
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, rotate: [0, 2, -2, 0] }}
              className={`relative p-6 rounded-2xl shadow-lg bg-gradient-to-br ${f.gradient} text-gray-900 dark:text-white transition-all duration-300`}
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{f.title}</h3>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{f.desc}</p>
              <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 hover:opacity-100 transition pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="bg-black py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">
            Why Choose Our Platform?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-16">
            Built for performance, accuracy and sustainability.
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            {[{ icon: "📊", title: "Accurate Analytics", desc: "Precise fuel and emission calculations." },
              { icon: "🤖", title: "AI Powered", desc: "Smart ML models that improve over time." },
              { icon: "🌍", title: "Green Impact", desc: "Lower fuel usage and carbon footprint." }].map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-indigo-500 transition"
              >
                <div className="text-5xl mb-4">{c.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white">{c.title}</h3>
                <p className="text-gray-400">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <div className="max-w-6xl mx-auto mt-24 px-6 pb-24">
        <h2 className="text-4xl font-extrabold text-center mb-4 text-gray-900 dark:text-white">What Users Say</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
          Real feedback from users who analyzed fuel efficiency with our platform
        </p>
        {feedbacks.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No feedback yet. Be the first to share your experience!
          </p>
        )}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {feedbacks.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition"
            >
              <span className="absolute -top-4 left-6 text-6xl text-indigo-500 opacity-20">“</span>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{f.comment}</p>
              <div className="mt-6 h-px bg-gradient-to-r from-indigo-500 to-emerald-500 opacity-40" />
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                  {f.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{f.name || "Anonymous"}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Verified User</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto py-24 px-6">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center"
          >
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-gray-600 dark:text-gray-300">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Home;
