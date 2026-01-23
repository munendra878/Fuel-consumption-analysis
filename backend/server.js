import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("./.env") });

import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";

// Routes
import userRoutes from "./src/routes/userRoutes.js";
import vehicleRoutes from "./src/routes/vehicleRoutes.js";
import predictRoutes from "./src/routes/predictRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";
import uploadRoutes from "./src/routes/upload.js";

const app = express();

// Connect to MongoDB
connectDB();

// ===== MIDDLEWARES =====
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,               // allow cookies/auth
  })
);
app.use(express.json());

// ===== ROUTES =====
app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/predict", predictRoutes);
app.use("/api/report", reportRoutes);
app.use("/api", uploadRoutes); // upload CSV route

// Serve generated reports folder
app.use("/reports", express.static(path.join(process.cwd(), "reports")));


app.get("/", (req, res) => res.send("Backend running"));

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
