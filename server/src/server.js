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
import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);

// Basic route for health checks
app.get("/", (_req, res) => {
  res.status(200).json({ message: "Welcome to the Roadmap API!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
