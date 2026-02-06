import Alert from "../models/alert.model.js";
import Camera from "../models/camera.model.js";

/**
 * This API:
 * 1. Receives snapshot + cameraId
 * 2. (Mock) AI analysis
 * 3. Creates alert if risk is high
 */
export const analyzeFrame = async (req, res) => {
  try {
    const { cameraId, image } = req.body;

    if (!cameraId || !image) {
      return res.status(400).json({
        message: "cameraId and image are required"
      });
    }

    const camera = await Camera.findById(cameraId);
    if (!camera) {
      return res.status(404).json({ message: "Camera not found" });
    }

    // -----------------------------
    // 🔴 MOCK AI RESPONSE (FOR NOW)
    // -----------------------------
    const aiResult = {
      riskScore: 82,
      reasons: ["Weapon-like object", "Aggressive activity"],
      boxes: [
        {
          x: 100,
          y: 60,
          width: 220,
          height: 160,
          label: "Weapon-like Object"
        }
      ]
    };

    // -----------------------------
    // Create alert if risk high
    // -----------------------------
    let alert = null;
    if (aiResult.riskScore >= 70) {
      alert = await Alert.create({
        cameraId,
        riskScore: aiResult.riskScore,
        reasons: aiResult.reasons,
        boxes: aiResult.boxes
      });
    }

    res.status(200).json({
      cameraId,
      aiResult,
      alertCreated: alert ? true : false,
      alert
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// AI service health check
export const getAIStatus = async (req, res) => {
  res.status(200).json({
    status: "AI service reachable (mock)",
    mode: "mock"
  });
};
