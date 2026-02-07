import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

import cameraRoutes from "./routes/camera.routes.js";
import alertRoutes from "./routes/alert.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import systemRoutes from "./routes/system.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

dotenv.config();

const app = express();

/* ------------------ MIDDLEWARE ------------------ */
app.use(express.json());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_PROD,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : "*",
    credentials: true,
  })
);

/* ------------------ DB ------------------ */
connectDB();

/* ------------------ ROUTES ------------------ */
app.use("/api/cameras", cameraRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (_, res) => {
  res.send("🚀 SentinelAI Backend is running");
});

/* ------------------ HTTP + SOCKET SERVER ------------------ */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins.length ? allowedOrigins : "*",
    credentials: true,
  },
});

/* ------------------ SOCKET LOGIC ------------------ */
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  /* ---- JOIN CAMERA (SAFE, IDPOTENT) ---- */
  socket.on("join-camera", (cameraId) => {
    if (!cameraId || typeof cameraId !== "string") return;

    // ❗ Prevent duplicate joins
    if (socket.rooms.has(cameraId)) {
      console.log(`⚠️ Socket ${socket.id} already in camera ${cameraId}`);
      return;
    }

    socket.join(cameraId);
    console.log(`📷 Socket ${socket.id} joined camera ${cameraId}`);
  });

  /* ---- CAMERA FRAME RELAY (FULL PAYLOAD) ---- */
  socket.on("camera-frame", (payload) => {
    const {
      cameraId,
      frame,
      boxes,
      riskScore,
      videoWidth,
      videoHeight,
    } = payload || {};

    if (!cameraId || !frame) return;

    // 🔥 THIS IS THE IMPORTANT PART
    socket.to(cameraId).emit("camera-frame", {
      cameraId,
      frame,
      boxes: Array.isArray(boxes) ? boxes : undefined,
      riskScore: typeof riskScore === "number" ? riskScore : undefined,
      videoWidth,
      videoHeight,
    });
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

/* ------------------ START SERVER ------------------ */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🟢 Server + WebSocket running on port ${PORT}`);
});