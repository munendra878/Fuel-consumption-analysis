import express from "express";
import Vehicle from "../models/Vehicle.js";
import fs from "fs";
import path from "path";

const router = express.Router();
const EMISSION_FACTOR = 2310; // g CO₂ per liter fuel



/* ================================
   GET /api/report/full-data
   Return full vehicle dataset
================================ */
router.get("/full-data", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();

    if (!vehicles.length) {
      return res.status(404).json({ message: "No vehicle data found" });
    }

    const data = vehicles.map((v) => ({
      engineSize: v.engineSize,
      horsepower: v.horsepower,
      cylinders: v.cylinders,
      fuelConsumption: v.fuelConsumption,
      co2: ((v.fuelConsumption * EMISSION_FACTOR) / 100).toFixed(2),
    }));

    res.json({
      totalVehicles: data.length,
      vehicles: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load full dataset" });
  }
});


/* ================================
   GET /api/report
   Dashboard statistics
================================ */
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();

    if (!vehicles.length) {
      return res.json({
        totalVehicles: 0,
        avgFuelConsumption: 0,
        cylindersCount: {},
        engineConsumption: {},
      });
    }

    const totalVehicles = vehicles.length;

    const avgFuelConsumption =
      vehicles.reduce((sum, v) => sum + v.fuelConsumption, 0) / totalVehicles;

    const cylindersCount = {};
    const engineTotals = {};

    vehicles.forEach((v) => {
      // Count cylinders
      cylindersCount[v.cylinders] =
        (cylindersCount[v.cylinders] || 0) + 1;

      // Engine-wise fuel consumption
      if (!engineTotals[v.engineSize]) {
        engineTotals[v.engineSize] = { sum: 0, count: 0 };
      }

      engineTotals[v.engineSize].sum += v.fuelConsumption;
      engineTotals[v.engineSize].count += 1;
    });

    const engineConsumption = {};
    Object.keys(engineTotals).forEach((engine) => {
      engineConsumption[engine] =
        engineTotals[engine].sum / engineTotals[engine].count;
    });

    res.json({
      totalVehicles,
      avgFuelConsumption: avgFuelConsumption.toFixed(2),
      cylindersCount,
      engineConsumption,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate report stats" });
  }
});

/* ================================
   POST /api/report/generate-report
   Generate CSV Report
================================ */
router.post("/generate-report", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();

    if (!vehicles.length) {
      return res.status(400).json({ message: "No vehicle data available" });
    }

    const headers = [
      "engineSize",
      "horsepower",
      "cylinders",
      "fuelConsumption(L/100km)",
      "co2(g/km)",
    ];

    const csvRows = [headers.join(",")];

    vehicles.forEach((v) => {
      const co2 = ((v.fuelConsumption * EMISSION_FACTOR) / 100).toFixed(2);

      csvRows.push(
        [
          v.engineSize,
          v.horsepower,
          v.cylinders,
          v.fuelConsumption,
          co2,
        ].join(",")
      );
    });

    // Create reports folder if not exists
    const reportsDir = path.join(process.cwd(), "reports");
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }

    const fileName = `vehicle_report_${Date.now()}.csv`;
    const filePath = path.join(reportsDir, fileName);

    fs.writeFileSync(filePath, csvRows.join("\n"));

    res.json({
      message: "Report generated successfully",
      downloadUrl: `/reports/${fileName}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate report" });
  }
});

export default router;
