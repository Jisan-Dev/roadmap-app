import RoadmapItem from "../models/RoadmapItem.js";
import Upvote from "../models/Upvote.js";

const getRoadmapItems = async (req, res) => {
  try {
    const { category, status, sort = "createdAt", order = "desc" } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    // Build sort object
    const validSortFields = ["createdAt", "title", "priority"];
    const sortField = validSortFields.includes(sort) ? sort : "createdAt";
    const sortOrder = order.toLowerCase() === "asc" ? 1 : -1;
    const sortObj = { [sortField]: sortOrder };

    // Get roadmap items with aggregation for counts
    const items = await RoadmapItem.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "upvotes",
          localField: "_id",
          foreignField: "roadmapItemId",
          as: "upvotes",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "roadmapItemId",
          as: "comments",
        },
      },
      {
        $addFields: {
          upvote_count: { $size: "$upvotes" },
          comment_count: { $size: "$comments" },
        },
      },
      {
        $project: {
          upvotes: 0,
          comments: 0,
        },
      },
      { $sort: sort === "upvote_count" ? { upvote_count: sortOrder } : sortObj },
    ]);

    // If user is authenticated, get their upvotes
    if (req.user) {
      const itemIds = items.map((item) => item._id);
      const userUpvotes = await Upvote.find({
        userId: req.user._id,
        roadmapItemId: { $in: itemIds },
      }).select("roadmapItemId");

      const userUpvoteSet = new Set(userUpvotes.map((u) => u.roadmapItemId.toString()));

      items.forEach((item) => {
        item.user_upvoted = userUpvoteSet.has(item._id.toString());
      });
    }

    res.json(items);
  } catch (error) {
    console.error("Error fetching roadmap items:", error);
    res.status(500).json({ error: "Error fetching roadmap items" });
  }
};

const toggleUpvote = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    // Check if roadmap item exists
    const roadmapItem = await RoadmapItem.findById(itemId);
    if (!roadmapItem) {
      return res.status(404).json({ error: "Roadmap item not found" });
    }

    // Check if upvote already exists
    const existingUpvote = await Upvote.findOne({
      userId,
      roadmapItemId: itemId,
    });

    if (existingUpvote) {
      // Remove upvote
      await Upvote.deleteOne({ _id: existingUpvote._id });
      res.json({ message: "Upvote removed", upvoted: false });
    } else {
      // Add upvote
      const upvote = new Upvote({
        userId,
        roadmapItemId: itemId,
      });
      await upvote.save();
      res.json({ message: "Upvote added", upvoted: true });
    }
  } catch (error) {
    console.error("Error toggling upvote:", error);
    res.status(500).json({ error: "Error toggling upvote" });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await RoadmapItem.distinct("category");
    res.json(categories.sort());
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Error fetching categories" });
  }
};

const getStatuses = (req, res) => {
  const statuses = ["Planning", "In Progress", "Completed", "On Hold"];
  res.json(statuses);
};

export { getCategories, getRoadmapItems, getStatuses, toggleUpvote };
