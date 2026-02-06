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

app.use(express.json());


const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_PROD
].filter(Boolean).map(o => o.replace(/\/$/, "")); // remove trailing slash

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("ORIGIN =>", origin);
      // allow server-to-server / Postman / curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: Origin not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

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


io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  // Phone joins a camera room
  socket.on("join-camera", (cameraId) => {
    socket.join(cameraId);
    console.log(`📷 Socket ${socket.id} joined camera ${cameraId}`);
  });

  // Phone sends frame
  socket.on("camera-frame", ({ cameraId, frame }) => {
    // Relay frame to all dashboard viewers of this camera
    socket.to(cameraId).emit("camera-frame", frame);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🟢 Server running on port ${PORT}`);
});
