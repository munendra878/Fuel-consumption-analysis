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

// DB
connectDB();

// CORS FIX ✅
const allowedOrigins = [
  "http://localhost:5173",
  "https://fuel-consumption-analysis.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true
  })
);

app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/predict", predictRoutes);
app.use("/api/report", reportRoutes);
app.use("/api", uploadRoutes);

app.use("/reports", express.static(path.join(process.cwd(), "reports")));

app.get("/", (req, res) => res.send("Backend running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
