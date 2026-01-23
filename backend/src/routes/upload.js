import express from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import Vehicle from "../models/vehicleModel.js";

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.endsWith(".csv")) {
      return cb(new Error("Only CSV files allowed"));
    }
    cb(null, true);
  },
});

// POST: Upload CSV
router.post("/upload-vehicles", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No CSV file uploaded" });
  }

  const vehicles = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      if (!row.engineSize || !row.fuelConsumption) return;

      const fuel = parseFloat(row.fuelConsumption);

      vehicles.push({
        engineSize: parseFloat(row.engineSize),
        horsepower: parseFloat(row.horsepower),
        cylinders: parseInt(row.cylinders),
        fuelConsumption: fuel,
        co2: row.co2
          ? parseFloat(row.co2)
          : fuel * 2310, // ✔ MATCH UI
      });
    })
    .on("end", async () => {
      try {
        if (vehicles.length === 0) {
          fs.unlinkSync(filePath);
          return res.status(400).json({ error: "CSV contains no valid data" });
        }

        await Vehicle.insertMany(vehicles);
        fs.unlinkSync(filePath);

        res.json({
          success: true,
          message: "CSV uploaded successfully!",
          count: vehicles.length,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database insert failed" });
      }
    })
    .on("error", (err) => {
      console.error(err);
      res.status(500).json({ error: "CSV parsing failed" });
    });
});

export default router;
