import Camera from "../models/camera.model.js";

// GET all cameras
export const getAllCameras = async (req, res) => {
  try {
    const cameras = await Camera.find().sort({ createdAt: -1 });
    res.status(200).json(cameras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST add new camera (WITH streamPath)
export const addCamera = async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        message: "Name and location are required"
      });
    }

    // Temporary camera (to get _id)
    const tempCamera = new Camera({
      name,
      location,
      streamPath: "temp"
    });

    // Generate stream path using Mongo _id
    tempCamera.streamPath = `/camera/${tempCamera._id}`;

    tempCamera.status = "offline";

    await tempCamera.save();

    res.status(201).json(tempCamera);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT update camera
export const updateCamera = async (req, res) => {
  try {
    const camera = await Camera.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!camera) {
      return res.status(404).json({ message: "Camera not found" });
    }

    res.status(200).json(camera);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE camera
export const deleteCamera = async (req, res) => {
  try {
    const camera = await Camera.findByIdAndDelete(req.params.id);

    if (!camera) {
      return res.status(404).json({ message: "Camera not found" });
    }

    res.status(200).json({ message: "Camera deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
