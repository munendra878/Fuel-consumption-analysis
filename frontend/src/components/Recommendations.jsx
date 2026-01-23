import { useEffect, useState } from "react";
import { FaCarSide, FaLeaf, FaStar } from "react-icons/fa";
import axios from "axios";

export default function Recommendations() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [minEfficiency, setMinEfficiency] = useState(0);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/vehicles");
        setVehicles(res.data);
      } catch (err) {
        console.error("Failed to fetch vehicles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles
    .filter((v) => (fuelType ? v.fuelType === fuelType : true))
    .filter((v) => (transmission ? v.transmission === transmission : true))
    .filter((v) => v.fuelEfficiency >= minEfficiency)
    .sort((a, b) => b.fuelEfficiency - a.fuelEfficiency);

  if (loading) return <div className="text-center py-10">Loading recommendations...</div>;
  if (!vehicles.length) return <div className="text-center py-10">No vehicles available.</div>;

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Recommended Vehicles</h2>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="border rounded-lg px-3 py-2">
          <option value="">All Fuel Types</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Electric">Electric</option>
        </select>

        <select value={transmission} onChange={(e) => setTransmission(e.target.value)} className="border rounded-lg px-3 py-2">
          <option value="">All Transmissions</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>

        <input
          type="number"
          placeholder="Min Efficiency (km/l)"
          value={minEfficiency}
          onChange={(e) => setMinEfficiency(Number(e.target.value))}
          className="border rounded-lg px-3 py-2 w-44"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((v, idx) => (
          <div key={v._id} className="bg-white rounded-xl shadow-lg p-5 relative">
            {idx < 3 && (
              <div className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                <FaStar /> Top Pick
              </div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <FaCarSide className="text-emerald-400 w-6 h-6" />
              <h3 className="text-xl font-semibold">{v.name || `Vehicle ${idx + 1}`}</h3>
            </div>
            <p>Engine: {v.engineSize}L | Cylinders: {v.cylinders}</p>
            <p>Fuel: {v.fuelType} | Transmission: {v.transmission}</p>
            <p className="font-medium">Efficiency: {v.fuelEfficiency} km/l</p>
            {v.fuelEfficiency >= 20 && (
              <div className="inline-flex items-center gap-1 text-green-600 font-semibold text-sm">
                <FaLeaf /> Eco-Friendly
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
