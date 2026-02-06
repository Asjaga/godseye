import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import cameraRoutes from "./routes/camera.routes.js";
import alertRoutes from "./routes/alert.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import systemRoutes from "./routes/system.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/cameras", cameraRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", (req, res) => {
  res.status(200).json({ message: "API endpoint found" });
});

app.get("/", (req, res) => {
  res.send("🚀 SentinelAI Backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🟢 Server running on port ${PORT}`);
});
