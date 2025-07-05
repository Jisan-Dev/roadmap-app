import express from "express";
import { getCategories, getRoadmapItems, toggleUpvote } from "../controllers/roadmapController.js";
const router = express.Router();

router.get("/items", getRoadmapItems);
router.get("/categories", getCategories);
router.post("/items/:itemId/upvote", toggleUpvote);

export default router;
