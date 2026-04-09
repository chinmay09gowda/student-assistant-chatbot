import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import { handleChat } from "./controllers/chatController.js";

dotenv.config();

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({ dest: uploadDir });
const app = express();

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || "*",
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

// Routes
app.post("/api/chat", upload.single("file"), handleChat);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`[backend] Server active on http://localhost:${PORT}`));
