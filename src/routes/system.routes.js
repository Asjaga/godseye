import express from "express";
import {
  getSystemStatus,
  silenceAlarm,
  notifyContacts,
  triggerEmergencyCall
} from "../controllers/system.controller.js";

const router = express.Router();

router.get("/status", getSystemStatus);
router.post("/alarm/silence", silenceAlarm);
router.post("/notify", notifyContacts);
router.post("/emergency-call", triggerEmergencyCall);

export default router;
