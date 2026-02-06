import mongoose from "mongoose";

const boxSchema = new mongoose.Schema(
  {
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    label: String
  },
  { _id: false }
);

const alertSchema = new mongoose.Schema(
  {
    cameraId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Camera",
      required: true
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    reasons: {
      type: [String],
      default: []
    },
    boxes: {
      type: [boxSchema],
      default: []
    },
    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active"
    }
  },
  { timestamps: true }
);

const Alert = mongoose.model("Alert", alertSchema);

export default Alert;
