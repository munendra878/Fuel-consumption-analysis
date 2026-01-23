import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;
const EMISSION_FACTOR = 2310;

export default function GenerateReport() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [showTable, setShowTable] = useState(false);

  /* ===============================
     Generate CSV Report
  =============================== */
  const handleGenerateReport = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${API_BASE}/api/report/generate-report`
      );

      // ✅ FIXED: use downloadUrl
      if (res.data?.downloadUrl) {
        window.open(`${API_BASE}${res.data.downloadUrl}`, "_blank");
        setMessage("✅ Report generated successfully!");
      } else {
        setMessage("⚠️ Report generated, but file not found");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     Load Full Dataset
  =============================== */
  const handleLoadFullData = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.get(
        `${API_BASE}/api/report/full-data`
      );

      // ✅ FIXED: read vehicles array correctly
      if (res.data?.vehicles?.length) {
        setVehicles(res.data.vehicles);
        setShowTable(true);
      } else {
        setMessage("⚠️ No vehicle data found");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to load dataset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 border rounded shadow bg-white dark:bg-gray-800">
      <h5 className="font-semibold mb-4 text-lg">
        Generate Vehicle Report
      </h5>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 mb-3">
        <button
          onClick={handleGenerateReport}
          disabled={loading}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Report (CSV)"}
        </button>

        <button
          onClick={handleLoadFullData}
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "View Uploaded Dataset"}
        </button>
      </div>

      {/* Message */}
      {message && (
        <p className="mb-3 text-blue-700 font-medium">{message}</p>
      )}

      {/* Dataset Table */}
      {showTable && vehicles.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <h6 className="font-semibold mb-2">
            Uploaded Vehicle Dataset
          </h6>

          <table className="table-auto w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Engine Size</th>
                <th className="border px-2 py-1">Horsepower</th>
                <th className="border px-2 py-1">Cylinders</th>
                <th className="border px-2 py-1">
                  Fuel (L/100km)
                </th>
                <th className="border px-2 py-1">
                  CO₂ (g/km)
                </th>
              </tr>
            </thead>

            <tbody>
              {vehicles.map((v, i) => {
                const co2 =
                  v.co2 ??
                  ((Number(v.fuelConsumption) * EMISSION_FACTOR) / 100).toFixed(2);

                return (
                  <tr key={i} className="odd:bg-white even:bg-gray-50">
                    <td className="border px-2 py-1">{v.engineSize}</td>
                    <td className="border px-2 py-1">{v.horsepower}</td>
                    <td className="border px-2 py-1">{v.cylinders}</td>
                    <td className="border px-2 py-1">
                      {v.fuelConsumption}
                    </td>
                    <td className="border px-2 py-1">{co2}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
