const router = require("express").Router();
const auth = require("../middleware/auth");
const Vehicle = require("../models/Vehicle");

// Dashboard for User & Admin
router.get("/", auth(), async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    const dashboardData = {
      totalVehicles: vehicles.length,
      avgFuelConsumption: vehicles.reduce((sum, v) => sum + v.fuelConsumption, 0) / (vehicles.length || 1),
      vehicles
    };
    res.json(dashboardData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin-only dashboard
router.get("/admin", auth(["admin"]), async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    const users = await require("../models/User").find();
    res.json({ totalVehicles: vehicles.length, totalUsers: users.length, vehicles, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
