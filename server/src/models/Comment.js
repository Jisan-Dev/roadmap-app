import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
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
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxLength: 300,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ roadmapItemId: 1, createdAt: 1 });
commentSchema.index({ parentCommentId: 1 });
commentSchema.index({ userId: 1 });

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
