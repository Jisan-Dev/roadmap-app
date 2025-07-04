import mongoose from "mongoose";

const roadmapItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000,
    },
    status: {
      type: String,
      required: true,
      enum: ["Planning", "In Progress", "Completed", "On Hold"],
      default: "Planning",
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// indexes for efficient querying
roadmapItemSchema.index({ status: 1 });
roadmapItemSchema.index({ category: 1 });
roadmapItemSchema.index({ priority: -1 });
roadmapItemSchema.index({ createdAt: -1 });

const RoadmapItem = mongoose.model("RoadmapItem", roadmapItemSchema);

export default RoadmapItem;
