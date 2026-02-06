import express from "express";
import { analyzeFrame, getAIStatus } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/analyze-frame", analyzeFrame);
router.get("/status", getAIStatus);

export default router;
