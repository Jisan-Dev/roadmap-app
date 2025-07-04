import mongoose from "mongoose";

const upvoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roadmapItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoadmapItem",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one upvote per user per item
upvoteSchema.index({ userId: 1, roadmapItemId: 1 }, { unique: true });

const Upvote = mongoose.model("Upvote", upvoteSchema);
export default Upvote;
