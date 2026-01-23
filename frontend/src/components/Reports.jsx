import React, { useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const EMISSION_FACTOR = 2310;

/* ===============================
   EMISSION RATING
================================ */
function getEmissionLevel(co2) {
  if (co2 <= 130) return { label: "Low", color: "green" };
  if (co2 <= 180) return { label: "Medium", color: "orange" };
  return { label: "High", color: "red" };
}

export default function Reports({ vehicles }) {
  const reportRef = useRef();

  if (!vehicles || vehicles.length === 0) {
    return (
      <p className="text-center mt-5">
        No vehicle data available to generate reports.
      </p>
    );
  }

  const totalVehicles = vehicles.length;

  /* ===============================
     AVERAGES
  =============================== */
  const avgFuel =
    vehicles.reduce((s, v) => s + Number(v.fuelConsumption), 0) /
    totalVehicles;

  const avgCO2 =
    vehicles.reduce((s, v) => {
      const co2 =
        v.co2 ??
        (Number(v.fuelConsumption) * EMISSION_FACTOR) / 100;
      return s + co2;
    }, 0) / totalVehicles;

  const avgEmission = getEmissionLevel(avgCO2);

  /* ===============================
     GROUPING
  =============================== */
  const engineSizes = [
    ...new Set(vehicles.map((v) => v.engineSize)),
  ].sort((a, b) => a - b);

  const avgFuelByEngine = engineSizes.map((size) => {
    const list = vehicles.filter((v) => v.engineSize === size);
    return (
      list.reduce((s, v) => s + Number(v.fuelConsumption), 0) /
      list.length
    ).toFixed(2);
  });

  const avgCO2ByEngine = engineSizes.map((size) => {
    const list = vehicles.filter((v) => v.engineSize === size);
    const total = list.reduce((s, v) => {
      const co2 =
        v.co2 ??
        (Number(v.fuelConsumption) * EMISSION_FACTOR) / 100;
      return s + co2;
    }, 0);
    return (total / list.length).toFixed(2);
  });

  /* ===============================
     CYLINDER PIE
  =============================== */
  const cylinderCounts = {};
  vehicles.forEach((v) => {
    cylinderCounts[v.cylinders] =
      (cylinderCounts[v.cylinders] || 0) + 1;
  });

  /* ===============================
     CHART DATA
  =============================== */
  const fuelBarData = {
    labels: engineSizes,
    datasets: [
      {
        label: "Avg Fuel (L/100km)",
        data: avgFuelByEngine,
        backgroundColor: "rgba(54,162,235,0.6)",
      },
    ],
  };

  const co2BarData = {
    labels: engineSizes,
    datasets: [
      {
        label: "Avg CO₂ (g/km)",
        data: avgCO2ByEngine,
        backgroundColor: avgCO2ByEngine.map(
          (v) => getEmissionLevel(v).color
        ),
      },
    ],
  };

  const co2TrendData = {
    labels: engineSizes,
    datasets: [
      {
        label: "CO₂ Trend (g/km)",
        data: avgCO2ByEngine,
        borderColor: "red",
        backgroundColor: "rgba(255,99,132,0.2)",
        tension: 0.4,
      },
    ],
  };

  const pieData = {
    labels: Object.keys(cylinderCounts),
    datasets: [
      {
        data: Object.values(cylinderCounts),
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#4bc0c0",
          "#9966ff",
        ],
      },
    ],
  };

  /* ===============================
     PDF DOWNLOAD
  =============================== */
  const downloadPDF = async () => {
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = 210;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("Fuel_Consumption_Report.pdf");
  };

  return (
    <div ref={reportRef} className="reports-container">
      {/* ===============================
          SUMMARY
      =============================== */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card p-3 text-center shadow">
            <h6>Total Vehicles</h6>
            <h3>{totalVehicles}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center shadow">
            <h6>Avg Fuel</h6>
            <h3>{avgFuel.toFixed(2)}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center shadow">
            <h6>Avg CO₂</h6>
            <h3>{avgCO2.toFixed(2)}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center shadow">
            <h6>Emission Level</h6>
            <h3 style={{ color: avgEmission.color }}>
              {avgEmission.label}
            </h3>
          </div>
        </div>
      </div>

      {/* ===============================
          CHARTS
      =============================== */}
      <div className="row mb-4">
        <div className="col-md-6">
          <Bar data={fuelBarData} />
        </div>
        <div className="col-md-6">
          <Bar data={co2BarData} />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <Line data={co2TrendData} />
        </div>
        <div className="col-md-6">
          <Pie data={pieData} />
        </div>
      </div>

      {/* ===============================
          PDF BUTTON
      =============================== */}
      <div className="text-center mt-4">
        <button
          onClick={downloadPDF}
          className="btn btn-danger px-4"
        >
          📄 Download PDF Report
        </button>
      </div>
    </div>
  );
}
