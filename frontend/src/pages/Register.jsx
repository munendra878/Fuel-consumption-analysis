import { SignUp } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

export default function Register() {
  const [darkMode, setDarkMode] = useState(false);

  // Optional: persist dark mode
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-100 via-green-100 to-emerald-100"
      }`}
    >
      <div
        className={`max-w-md w-full p-8 rounded-2xl shadow-xl ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <h2 className="text-3xl font-bold text-center mb-6">
          Create Your Account
        </h2>

        <SignUp
          routing="path"
          path="/register"
          signInUrl="/login"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            baseTheme: darkMode ? "dark" : "light",
            variables: {
              colorPrimary: "#4F46E5",
            },
          }}
        />

        <p className={`text-sm text-center mt-4 ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
          Already have an account?{" "}
          <a
            href="/login"
            className={`font-medium ${darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-emerald-500 hover:text-emerald-600"}`}
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
