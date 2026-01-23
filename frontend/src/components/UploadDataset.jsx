import { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const EMISSION_FACTOR = 2310;

export default function UploadDataset({ onUpdateVehicles }) {
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [stats, setStats] = useState({
    totalCO2: 0,
    vehicleCount: 0,
    avgFuel: 0,
    engineTypes: 0,
  });

  const axiosAuth = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
  });

  /* ===============================
     CSV SELECT + PREVIEW
  =============================== */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setMessage("");
    setIsError(false);

    Papa.parse(selectedFile, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        if (!data.length) {
          setMessage("CSV is empty");
          setIsError(true);
          return;
        }

        const valid = data.filter(
          (r) =>
            r.engineSize &&
            r.horsepower &&
            r.cylinders &&
            r.fuelConsumption
        );

        if (!valid.length) {
          setMessage("Invalid CSV structure");
          setIsError(true);
          return;
        }

        setRows(valid);

        // Stats
        let totalFuel = 0;
        let totalCO2 = 0;

        valid.forEach((v) => {
          totalFuel += v.fuelConsumption;
          totalCO2 += (v.fuelConsumption * EMISSION_FACTOR) / 100;
        });

        setStats({
          totalCO2,
          vehicleCount: valid.length,
          avgFuel: totalFuel / valid.length,
          engineTypes: new Set(valid.map((v) => v.engineSize)).size,
        });
      },
    });
  };

  /* ===============================
     UPLOAD (FIXED)
  =============================== */
  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a CSV file");
      setIsError(true);
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file); // 🔥 IMPORTANT

      const res = await axiosAuth.post(
        "/upload-vehicles",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(`${res.data.count} vehicles uploaded successfully`);
      setIsError(false);

      onUpdateVehicles && onUpdateVehicles();
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.error || "Upload failed"
      );
      setIsError(true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow bg-white">
      <h5 className="font-semibold mb-3">Load Vehicle Dataset (CSV)</h5>

      <input type="file" accept=".csv" onChange={handleFileChange} />

      {rows.length > 0 && (
        <div className="mt-3">
          <StatCard title="Vehicles" value={stats.vehicleCount} />
          <StatCard title="Avg Fuel" value={stats.avgFuel.toFixed(2)} />
          <StatCard title="CO₂" value={`${stats.totalCO2.toFixed(2)} g`} />
          <StatCard title="Engine Types" value={stats.engineTypes} />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {uploading ? "Uploading..." : "Upload Dataset"}
      </button>

      {message && (
        <p className={isError ? "text-red-600 mt-2" : "text-green-600 mt-2"}>
          {message}
        </p>
      )}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="inline-block p-2 m-1 border rounded text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}
