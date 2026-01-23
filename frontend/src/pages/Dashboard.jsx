import "../styles/dashboard.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useUser, SignOutButton, UserButton } from "@clerk/clerk-react";
import Reports from "../components/Reports.jsx";
import PredictionCard from "../components/PredictionCard.jsx";
import UploadDataset from "../components/UploadDataset.jsx";
import GenerateReport from "../components/GenerateReport.jsx";
import ChatBot from "../components/ChatBot.jsx";



// CO2 emission factor (g/km per liter of fuel)
const EMISSION_FACTOR = 2392;

// ===== Reusable Stat Card =====
export function Stat({ title, value, tooltip }) {
  return (
    <div className="col-md-3 col-6">
      <div className="card shadow text-center p-3 mb-3" title={tooltip}>
        <h6 className="text-muted">{title}</h6>
        <h3 className="fw-bold">{value}</h3>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useUser();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);

  const role = user?.publicMetadata?.role || "user";

  // Load all vehicles from backend
  const fetchVehicles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/vehicles");
      const vehiclesWithCO2 = res.data.map((v) => ({
        ...v,
        fuelConsumption: Number(v.fuelConsumption) || 0,
        co2: (Number(v.fuelConsumption) || 0) * EMISSION_FACTOR,
      }));
      setVehicles(vehiclesWithCO2);
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

  // Add vehicle locally (after prediction or upload)
  const handleAddVehicle = (vehicle) => {
    const vehicleWithCO2 = {
      ...vehicle,
      fuelConsumption: Number(vehicle.fuelConsumption) || 0,
      co2: (Number(vehicle.fuelConsumption) || 0) * EMISSION_FACTOR,
    };
    setVehicles((prev) => [...prev, vehicleWithCO2]);
  };

  // Delete vehicle
  const handleDeleteVehicle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/vehicles/${id}`);
      setVehicles((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete vehicle. Check console for details.");
    }
  };

  // Recommendation: lowest fuel per engine size
  const getRecommendations = () => {
    const engineGroups = {};
    vehicles.forEach((v) => {
      if (
        !engineGroups[v.engineSize] ||
        v.fuelConsumption < engineGroups[v.engineSize].fuelConsumption
      ) {
        engineGroups[v.engineSize] = v;
      }
    });
    return Object.values(engineGroups).sort((a, b) => a.engineSize - b.engineSize);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }

  const avgFuel =
    vehicles.length > 0
      ? vehicles.reduce((s, v) => s + v.fuelConsumption, 0) / vehicles.length
      : 0;

  const avgCO2 =
    vehicles.length > 0
      ? vehicles.reduce((s, v) => s + v.co2, 0) / vehicles.length
      : 0;

  const recommendations = getRecommendations();

  return (
    <div className={`dashboard ${darkMode ? "dark" : ""}`}>
      {/* SIDEBAR */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          {!collapsed && <h5>🚗 Fuel Dashboard</h5>}
          <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? "➡" : "⬅"}
          </button>
        </div>

        {!collapsed && (
          <div className="profile">
            <UserButton />
            <h6>{user?.fullName}</h6>
            <small>{user?.primaryEmailAddress?.emailAddress}</small>
            <div className="badge bg-info mt-2">{role.toUpperCase()}</div>
          </div>
        )}

        <nav>
          {[
            ["dashboard", "📊 Dashboard"],
            ["vehicles", "🚘 Vehicles"],
            ["predict", "📈 Prediction"],
            ["reports", "🧾 Reports"],
            ["recommend", "⭐ Recommendations"],
            ["upload", "⬆ Upload & Generate Reports"],
           ["chatbot", "🤖 AI Chatbot"],

          ].map(([key, label]) => (
            <button
              key={key}
              className={`menu-btn ${active === key ? "active" : ""}`}
              onClick={() => setActive(key)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <SignOutButton redirectUrl="/">
            <button className="logout-btn">Logout</button>
          </SignOutButton>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="top-bar">
          <div>
            <h2>Fuel Consumption Dashboard</h2>
            <p>Smart analysis & prediction system</p>
          </div>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* STATS GRID */}
        <section className="stats-grid row">
          <Stat title="Total Vehicles" value={vehicles.length} tooltip="Number of vehicles in the system" />
          <Stat title="Avg Fuel" value={`${avgFuel.toFixed(2)} L/100km`} tooltip="Average fuel consumption" />
          <Stat title="Avg CO₂" value={`${avgCO2.toFixed(0)} g/km`} tooltip="Average CO₂ emission" />
          <Stat
            title="Engine Types"
            value={new Set(vehicles.map((v) => v.engineSize)).size}
            tooltip="Number of unique engine sizes"
          />
        </section>

        {/* VEHICLE TABLE */}
        {(active === "dashboard" || active === "vehicles") && (
          <section className="content-card">
            <div className="content-card-header">Vehicle Details</div>
            {vehicles.length === 0 ? (
              <p className="text-center mt-3">No vehicle data available.</p>
            ) : (
              <div className="table-responsive">
                <table className="table custom-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Engine Size (L)</th>
                      <th>Horsepower</th>
                      <th>Cylinders</th>
                      <th>Fuel Consumption</th>
                      <th>CO₂ Emission (g/km)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((v, i) => (
                      <tr key={v._id || i}>
                        <td>{i + 1}</td>
                        <td>{v.engineSize}</td>
                        <td>{v.horsepower}</td>
                        <td>{v.cylinders}</td>
                        <td>{v.fuelConsumption.toFixed(2)}</td>
                        <td>{v.co2.toFixed(0)}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteVehicle(v._id)}
                            className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* PREDICTION */}
        {active === "predict" && (
          <section className="content-card">
            <PredictionCard onAddVehicle={handleAddVehicle} />
          </section>
        )}

        {/* REPORTS */}
        {active === "reports" && (
          <section className="content-card">
            <Reports vehicles={vehicles} />
          </section>
        )}

        {/* UPLOAD & GENERATE REPORT */}
        {active === "upload" && (
          <section className="content-card">
            <h5 className="section-title">Upload Dataset & Generate Reports</h5>
            <UploadDataset axiosAuth={axios} onUpdateVehicles={fetchVehicles} />
            <GenerateReport vehicles={vehicles} axiosAuth={axios} />
          </section>
        )}

        {/* CHATBOT */}
{active === "chatbot" && (
  <section className="content-card">
    <h5 className="section-title mb-6 text-lg font-bold">
      AI Chatbot
    </h5>
    <ChatBot />
  </section>
)}


        {/* RECOMMENDATIONS */}
        {active === "recommend" && (
          <section className="content-card">
            <h5 className="section-title mb-6 text-lg font-bold">
              Recommended Vehicles (Lowest Fuel per Engine Size)
            </h5>

            {recommendations.length === 0 ? (
              <p className="text-center mt-3">No recommendations available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations
                  .sort((a, b) => a.fuelConsumption - b.fuelConsumption) // lowest fuel first
                  .map((v, i) => (
                    <div
                      key={v._id || i}
                      className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition-shadow relative"
                    >
                      {i < 3 && (
                        <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Top Pick
                        </div>
                      )}

                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{v.name || `Vehicle ${i + 1}`}</h3>
                      </div>

                      <p className="text-gray-500 text-sm">
                        Engine Size: {v.engineSize}L
                      </p>
                      <p className="text-gray-500 text-sm">
                        Horsepower: {v.horsepower} | Cylinders: {v.cylinders}
                      </p>
                      <p className="text-gray-700 font-medium mt-1">
                        Fuel Consumption: {v.fuelConsumption.toFixed(2)} L/100km
                      </p>
                      <p className="text-gray-700 font-medium">
                        CO₂ Emission: {v.co2.toFixed(0)} g/km
                      </p>

                      {v.fuelConsumption <= 5 && (
                        <span className="inline-flex items-center gap-1 text-green-600 font-semibold mt-2 text-sm">
                          <span>🌿</span> Eco-Friendly
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
