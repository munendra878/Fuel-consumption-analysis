import { motion } from "framer-motion";

const blogs = [
  {
    id: 1,
    title: "How AI Improves Fuel Efficiency Analysis",
    date: "March 2026",
    author: "Admin",
    description:
      "Artificial Intelligence helps analyze fuel consumption patterns, predict usage, and reduce environmental impact through smart insights.",
  },
  {
    id: 2,
    title: "Understanding Fuel Consumption Metrics",
    date: "February 2026",
    author: "Admin",
    description:
      "Learn how mileage, fuel rate, and CO₂ emissions are calculated and why they matter for sustainable transportation.",
  },
  {
    id: 3,
    title: "Reducing Carbon Emissions Using Data Analytics",
    date: "January 2026",
    author: "Admin",
    description:
      "Data analytics enables better decisions by identifying inefficiencies and promoting eco-friendly driving habits.",
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen px-6 py-20 bg-gradient-to-br from-slate-900 to-gray-800 text-white">
      
      {/* ===== TITLE ===== */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-center mb-12"
      >
        Blog & Insights
      </motion.h1>

      {/* ===== BLOG LIST ===== */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {blogs.map((blog, index) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white/10 backdrop-blur rounded-2xl p-6 shadow-xl hover:scale-[1.02] transition"
          >
            <h2 className="text-xl font-semibold mb-2">
              {blog.title}
            </h2>

            <p className="text-sm text-gray-400 mb-3">
              {blog.date} • {blog.author}
            </p>

            <p className="text-gray-200 mb-4">
              {blog.description}
            </p>

            <button className="mt-auto inline-block text-indigo-400 hover:text-indigo-300 font-medium">
              Read More →
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
