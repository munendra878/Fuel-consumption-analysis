import { motion } from "framer-motion";
import developerImg from "../assets/developer.png"
import { Github, Linkedin, Mail, Briefcase } from "lucide-react";


export default function Developer() {
  return (
    <div className="min-h-screen px-6 py-20 bg-gradient-to-br from-slate-900 to-gray-800 text-white">

      {/* TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center mb-10"
      >
        Meet the Developer
      </motion.h1>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto bg-white/10 backdrop-blur
                   rounded-3xl p-8 shadow-2xl"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">

          {/* PHOTO */}
          <div className="flex justify-center">
            <img
              src={developerImg}
              alt="Developer"
              className="w-52 h-52 rounded-full object-cover
                         border-4 border-indigo-500 shadow-lg"
            />
          </div>

          {/* INFO */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold">Munendrasinh baghel</h2>
            <p className="text-indigo-400 mt-1">Full Stack Developer</p>

            <p className="text-gray-200 mt-4 leading-relaxed">
              Developer of the <b>Fuel Consumption Analysis System</b>, built using
              <span className="font-semibold text-white">
                {" "}React, Tailwind CSS, Clerk Authentication, AI & Data Analytics
              </span>.
              Passionate about clean UI, performance, and sustainability-focused
              applications.
            </p>

            {/* SOCIAL LINKS */}
            <div className="flex justify-center md:justify-start gap-4 mt-6">
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

              <a
                href="mailto:mohitbaghel086@gmail.com"
                className="p-3 rounded-full bg-black/40 hover:bg-indigo-600 transition"
              >
                <Mail />
              </a>
            </div>
          </div>
        </div>

        {/* TECH STACK */}
        <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { title: "Frontend", value: "React, Tailwind" },
            { title: "Auth", value: "Clerk" },
            { title: "Animations", value: "Framer Motion" },
            { title: "Purpose", value: "Fuel & Emission Analysis" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-black/30"
            >
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-gray-300">{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
