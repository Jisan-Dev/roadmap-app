import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import dbConnection from "./config/db.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB database
dbConnection();

// Middlewares
app.use(cors());
app.use(express.json());

// App API Routes
import errorHandler from "./middlewares/error.js";
import authRoutes from "./routes/authRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";

app.use("/api/roadmap", roadmapRoutes);
app.use("/api/auth", authRoutes);

// Basic route for health checks
app.get("/", (_req, res) => {
  res.status(200).json({ message: "Welcome to the Roadmap API!" });
});

// 404 Not Found handler
app.use((_req, res) => {
  res.status(404).json({ message: "Resource not found" });
});

// Central error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
