import Alert from "../models/alert.model.js";
import Camera from "../models/camera.model.js";

// GET alerts (with optional filters)
export const getAlerts = async (req, res) => {
  try {
    const { status, cameraId } = req.query;

    const query = {};
    if (status) query.status = status;
    if (cameraId) query.cameraId = cameraId;

    const alerts = await Alert.find(query)
      .populate("cameraId", "name location")
      .sort({ createdAt: -1 });

    // 🚨 REMOVE BROKEN REFERENCES
    const cleanAlerts = alerts.filter(
      (alert) => alert.cameraId !== null
    );

    res.status(200).json(cleanAlerts);
  } catch (error) {
    console.error("GET ALERTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// POST create alert (from AI)
export const createAlert = async (req, res) => {
  try {
    const { cameraId, riskScore, reasons, boxes } = req.body;

    if (!cameraId || riskScore === undefined) {
      return res.status(400).json({
        message: "cameraId and riskScore are required"
      });
    }

    const camera = await Camera.findById(cameraId);
    if (!camera) {
      return res.status(404).json({ message: "Camera not found" });
    }

    const alert = await Alert.create({
      cameraId,
      riskScore,
      reasons,
      boxes
    });

    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT update / resolve alert
export const updateAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    res.status(200).json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE alert
export const deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    res.status(200).json({ message: "Alert deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
