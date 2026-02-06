import express from "express";
import {
  getAllCameras,
  addCamera,
  updateCamera,
  deleteCamera
} from "../controllers/camera.controller.js";

const router = express.Router();

router.get("/", getAllCameras);
router.post("/", addCamera);
router.put("/:id", updateCamera);
router.delete("/:id", deleteCamera);

export default router;
