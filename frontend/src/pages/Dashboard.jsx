import "../styles/dashboard.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useUser, SignOutButton, UserButton } from "@clerk/clerk-react";

import Reports from "../components/Reports.jsx";
import PredictionCard from "../components/PredictionCard.jsx";
import UploadDataset from "../components/UploadDataset.jsx";
import GenerateReport from "../components/GenerateReport.jsx";
import ChatBot from "../components/ChatBot.jsx";

const API_URL = import.meta.env.VITE_API_URL;
const EMISSION_FACTOR = 2392;

/* ================= Stat Card ================= */
export function Stat({ title, value, tooltip }) {
  return (
    <div className="stat-card" title={tooltip}>
      <h6>{title}</h6>
      <h3>{value}</h3>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role || "user";

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(true); // IMPORTANT for mobile
  const [active, setActive] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);

  /* ================= Fetch Vehicles ================= */
  const fetchVehicles = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/vehicles`);
      setVehicles(
        res.data.map((v) => ({
          ...v,
          fuelConsumption: Number(v.fuelConsumption) || 0,
          co2: (Number(v.fuelConsumption) || 0) * EMISSION_FACTOR,
        }))
      );
    } catch (err) {
      setError("Failed to load vehicle data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  /* ================= Add Vehicle ================= */
  const handleAddVehicle = (vehicle) => {
    setVehicles((prev) => [
      ...prev,
      {
        ...vehicle,
        fuelConsumption: Number(vehicle.fuelConsumption) || 0,
        co2: (Number(vehicle.fuelConsumption) || 0) * EMISSION_FACTOR,
      },
    ]);
  };

  /* ================= Delete Vehicle ================= */
  const handleDeleteVehicle = async (id) => {
    if (!window.confirm("Delete this vehicle?")) return;
    await axios.delete(`${API_URL}/api/vehicles/${id}`);
    setVehicles((prev) => prev.filter((v) => v._id !== id));
  };

  /* ================= Recommendation ================= */
  const recommendations = Object.values(
    vehicles.reduce((acc, v) => {
      if (!acc[v.engineSize] || v.fuelConsumption < acc[v.engineSize].fuelConsumption) {
        acc[v.engineSize] = v;
      }
      return acc;
    }, {})
  );

  const avgFuel =
    vehicles.length > 0
      ? vehicles.reduce((s, v) => s + v.fuelConsumption, 0) / vehicles.length
      : 0;

  const avgCO2 =
    vehicles.length > 0
      ? vehicles.reduce((s, v) => s + v.co2, 0) / vehicles.length
      : 0;

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className={`dashboard ${darkMode ? "dark" : ""}`}>
      {/* ================= SIDEBAR ================= */}
      <aside className={`sidebar ${collapsed ? "" : "collapsed"}`}>
        <div className="sidebar-header">
          <h5>🚗 Fuel Dashboard</h5>
          <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
            ☰
          </button>
        </div>

        <div className="profile">
          <UserButton />
          <h6>{user?.fullName}</h6>
          <small>{user?.primaryEmailAddress?.emailAddress}</small>
          <div className="badge bg-info">{role.toUpperCase()}</div>
        </div>

        <nav>
          {[
            ["dashboard", "📊 Dashboard"],
            ["vehicles", "🚘 Vehicles"],
            ["predict", "📈 Prediction"],
            ["reports", "🧾 Reports"],
            ["upload", "⬆ Upload"],
            ["recommend", "⭐ Recommendations"],
            ["chatbot", "🤖 AI Chatbot"],
          ].map(([key, label]) => (
            <button
              key={key}
              className={`menu-btn ${active === key ? "active" : ""}`}
              onClick={() => {
                setActive(key);
                setCollapsed(true); // auto close on mobile
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        <SignOutButton redirectUrl="/">
          <button className="logout-btn">Logout</button>
        </SignOutButton>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="main-content">
        {/* TOP BAR */}
        <div className="top-bar">
          <div>
            <h2>Fuel Consumption Dashboard</h2>
            <p>Smart analysis & prediction system</p>
          </div>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <Stat title="Total Vehicles" value={vehicles.length} />
          <Stat title="Avg Fuel" value={`${avgFuel.toFixed(2)} L`} />
          <Stat title="Avg CO₂" value={`${avgCO2.toFixed(0)} g`} />
          <Stat title="Engine Types" value={new Set(vehicles.map(v => v.engineSize)).size} />
        </div>

        {/* VEHICLES */}
        {(active === "dashboard" || active === "vehicles") && (
          <section className="content-card">
            <h5>Vehicle Details</h5>
            {vehicles.map((v, i) => (
              <div className="vehicle-card" key={v._id}>
                <div>Engine: {v.engineSize} L</div>
                <div>Horsepower: {v.horsepower}</div>
                <div>Cylinders: {v.cylinders}</div>
                <div>Fuel: {v.fuelConsumption.toFixed(2)}</div>
                <div>CO₂: {v.co2.toFixed(0)}</div>
                <button onClick={() => handleDeleteVehicle(v._id)}>Delete</button>
              </div>
            ))}
          </section>
        )}

        {active === "predict" && <PredictionCard onAddVehicle={handleAddVehicle} />}
        {active === "reports" && <Reports vehicles={vehicles} />}
        {active === "upload" && (
          <>
            <UploadDataset axiosAuth={axios} onUpdateVehicles={fetchVehicles} />
            <GenerateReport vehicles={vehicles} axiosAuth={axios} />
          </>
        )}
        {active === "chatbot" && <ChatBot />}

        {active === "recommend" && (
          <div className="stats-grid">
            {recommendations.map((v, i) => (
              <div key={i} className="recommend-card">
                <h6>{v.engineSize}L Engine</h6>
                <p>Fuel: {v.fuelConsumption.toFixed(2)}</p>
                <p>CO₂: {v.co2.toFixed(0)}</p>
                {v.fuelConsumption <= 5 && <span className="eco">🌿 Eco Friendly</span>}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

