// backend/src/routes/predictRoutes.js
import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Prediction API is live! Use POST with engineSize, horsepower, cylinders.");
});

router.post("/", async (req, res) => {
  try {
    const { engineSize, horsepower, cylinders } = req.body;
    if (!engineSize || !horsepower || !cylinders) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Forward to ML server or simple mock prediction
    // Replace this with actual ML API if available
    const predictedFuel = Number((0.05 * engineSize * horsepower + 5 + cylinders).toFixed(2)); // mock formula

    res.json({ predictedFuel });
  } catch (err) {
    console.error("Prediction error:", err.message);
    res.status(500).json({ error: "Prediction failed" });
  }
});

export default router;
