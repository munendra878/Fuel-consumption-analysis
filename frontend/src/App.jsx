import { Routes, Route, useLocation } from "react-router-dom";
import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Devloper from "./pages/Devloper";
import Feedback from "./pages/Feedback";
import Blogs from "./pages/Blogs";
import About from "./pages/About";
import Privacy from "./pages/Privacy";


function App() {
  const location = useLocation();

  // ❗ Hide Navbar & Footer on auth pages
  const hideLayout =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register");

  return (
    <>
      {!hideLayout && <Navbar />}

      <main className="min-h-screen">
        <Routes>
          {/* ===== PUBLIC ROUTES ===== */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/developer" element={<Devloper />} />
          <Route path="/home" element={<Home />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* ===== AUTH ROUTES ===== */}
          <Route
            path="/login/*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <SignIn routing="path" path="/login" />
              </div>
            }
          />

          <Route
            path="/register/*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <SignUp routing="path" path="/register" />
              </div>
            }
          />

          {/* ===== PROTECTED DASHBOARD ===== */}
          <Route
            path="/dashboard"
            element={
              <>
                <SignedIn>
                  <Dashboard />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
           
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
