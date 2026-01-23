// backend/src/routes/vehicleRoutes.js
import express from "express";
import Vehicle from "../models/Vehicle.js";

const router = express.Router();

// GET all vehicles
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    const vehiclesWithEfficiency = vehicles.map((v) => ({
      ...v.toObject(),
      fuelEfficiency: Number((100 / v.fuelConsumption).toFixed(2)), // km/l
    }));
    res.json(vehiclesWithEfficiency);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST a new vehicle
router.post("/", async (req, res) => {
  try {
    const { engineSize, horsepower, cylinders, fuelConsumption, name, fuelType, transmission } = req.body;

    if (!engineSize || !horsepower || !cylinders || !fuelConsumption) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const vehicle = new Vehicle({ engineSize, horsepower, cylinders, fuelConsumption, name, fuelType, transmission });
    await vehicle.save();

    // Add fuelEfficiency for frontend convenience
    const vehicleWithEfficiency = {
      ...vehicle.toObject(),
      fuelEfficiency: Number((100 / vehicle.fuelConsumption).toFixed(2)),
    };

    res.status(201).json(vehicleWithEfficiency);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE a vehicle by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid vehicle ID" });
    }

    const result = await Vehicle.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
