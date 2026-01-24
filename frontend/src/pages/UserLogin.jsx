import { Link } from "react-router-dom";
import { SignIn } from "@clerk/clerk-react";

export default function UserLogin() {
  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-xl font-bold text-indigo-600">
            Fuel Consumption
          </h1>

          {/* Links */}
          <div className="space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Home
            </Link>
            <Link
              to="/register"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="text-indigo-600 font-semibold"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= LOGIN PAGE ================= */}
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-24 md:pt-28">
        <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
          <SignIn
            routing="path"
            path="/login"
            signUpUrl="/register"
            fallbackRedirectUrl="/dashboard"
            appearance={{
              baseTheme: "light", // change to "dark" if you want dark mode
              variables: {
                colorPrimary: "#4F46E5", // Indigo-600
              },
            }}
          />
        </div>
      </div>
    </>
  );
}
