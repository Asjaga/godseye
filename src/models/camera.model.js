import mongoose from "mongoose";

const cameraSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline"
    },
    streamPath: {
      type: String,
      required: true,
      unique: true
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Camera = mongoose.model("Camera", cameraSchema);

export default Camera;
