import { useState } from "react";
import axios from "axios";

export default function PredictionCard({ onAddVehicle }) {
  const [engineSize, setEngineSize] = useState("");
  const [horsepower, setHorsepower] = useState("");
  const [cylinders, setCylinders] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!engineSize || !horsepower || !cylinders) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.post("http://localhost:5000/api/predict", {
        engineSize: Number(engineSize),
        horsepower: Number(horsepower),
        cylinders: Number(cylinders),
      });

      const predictedFuel = res.data.predictedFuel;
      setResult(predictedFuel);

      const saved = await axios.post("http://localhost:5000/api/vehicles", {
        engineSize: Number(engineSize),
        horsepower: Number(horsepower),
        cylinders: Number(cylinders),
        fuelConsumption: predictedFuel,
        name: `Vehicle ${Date.now()}`,
        fuelType: "Petrol",
        transmission: "Manual",
      });

      if (onAddVehicle) onAddVehicle(saved.data);

      setEngineSize("");
      setHorsepower("");
      setCylinders("");
    } catch (err) {
      setError(err.response?.data?.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow p-4 mb-4">
      <h5 className="fw-bold mb-3">Predict Fuel Consumption</h5>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-4">
            <input
              type="number"
              step="0.1"
              className="form-control"
              placeholder="Engine Size (L)"
              value={engineSize}
              onChange={(e) => setEngineSize(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              type="number"
              className="form-control"
              placeholder="Horsepower"
              value={horsepower}
              onChange={(e) => setHorsepower(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              type="number"
              className="form-control"
              placeholder="Cylinders"
              value={cylinders}
              onChange={(e) => setCylinders(e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {result !== null && (
        <div className="alert alert-success mt-3">
          Predicted Fuel Consumption: <strong>{result.toFixed(2)} L/100km</strong>
        </div>
      )}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
