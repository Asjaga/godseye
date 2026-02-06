import Camera from "../models/camera.model.js";
import Alert from "../models/alert.model.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const totalCameras = await Camera.countDocuments();
    const activeCameras = await Camera.countDocuments({ status: "online" });

    const activeAlerts = await Alert.countDocuments({ status: "active" });

    const latestAlert = await Alert.findOne({ status: "active" })
      .sort({ createdAt: -1 })
      .select("riskScore");

    const overallRisk = latestAlert ? latestAlert.riskScore : 0;

    res.status(200).json({
      totalCameras,
      activeCameras,
      activeAlerts,
      overallRisk
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
