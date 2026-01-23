import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen px-6 py-20 bg-gradient-to-br from-slate-900 to-gray-800 text-white">
      
      {/* ===== TITLE ===== */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-center mb-10"
      >
        About Fuel Consumption Analysis
      </motion.h1>

      {/* ===== CONTENT CARD ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-5xl mx-auto bg-white/10 backdrop-blur rounded-2xl p-8 md:p-12 shadow-xl space-y-8"
      >
        {/* INTRO */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Project Overview</h2>
          <p className="text-gray-200 leading-relaxed">
            The <b>Fuel Consumption Analysis System</b> is a smart web-based
            application designed to analyze automobile fuel usage, predict
            consumption patterns, and provide eco-friendly insights using
            data analytics and AI-driven techniques.
          </p>
        </section>

        {/* OBJECTIVES */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Objectives</h2>
          <ul className="list-disc list-inside text-gray-200 space-y-2">
            <li>Analyze vehicle fuel consumption data accurately</li>
            <li>Predict future fuel usage using AI models</li>
            <li>Estimate CO₂ emissions and environmental impact</li>
            <li>Provide optimization recommendations for efficiency</li>
            <li>Promote sustainable and eco-friendly transportation</li>
          </ul>
        </section>

        {/* FEATURES */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-4 text-gray-200">
            <div className="p-4 rounded-xl bg-black/30">
              📊 Real-time fuel analysis dashboard
            </div>
            <div className="p-4 rounded-xl bg-black/30">
              🤖 AI-based consumption predictions
            </div>
            <div className="p-4 rounded-xl bg-black/30">
              🌱 CO₂ emission calculations
            </div>
            <div className="p-4 rounded-xl bg-black/30">
              📁 Dataset upload & reporting
            </div>
            <div className="p-4 rounded-xl bg-black/30">
              🔐 Secure authentication (Clerk)
            </div>
            <div className="p-4 rounded-xl bg-black/30">
              🌙 Dark mode & modern UI
            </div>
          </div>
        </section>

        {/* TECH STACK */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Technology Stack</h2>
          <div className="grid md:grid-cols-3 gap-4 text-gray-200">
            <div className="p-4 bg-black/30 rounded-xl">
              <h3 className="font-semibold">Frontend</h3>
              <p>React, Vite, Tailwind CSS</p>
            </div>
            <div className="p-4 bg-black/30 rounded-xl">
              <h3 className="font-semibold">Authentication</h3>
              <p>Clerk</p>
            </div>
            <div className="p-4 bg-black/30 rounded-xl">
              <h3 className="font-semibold">Analytics</h3>
              <p>AI Models & Data Processing</p>
            </div>
          </div>
        </section>

        {/* FUTURE SCOPE */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Future Enhancements</h2>
          <ul className="list-disc list-inside text-gray-200 space-y-2">
            <li>Live vehicle sensor data integration</li>
            <li>Advanced AI prediction models</li>
            <li>Fleet management support</li>
            <li>Mobile app integration</li>
            <li>Carbon credit tracking</li>
          </ul>
        </section>
      </motion.div>
    </div>
  );
}
