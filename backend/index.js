import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

import commentRoutes from "./routes/commentRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// File paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_URL = process.env.CLIENT_URL;

// ────────────── CORS + Socket.io
const io = new Server(server, {
  transports: ["websocket", "polling"],
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
  },
});

app.set("io", io);

app.use((req, res, next) => {
  req.io = io;
  next();
});

// ────────────── Middleware
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

// ────────────── API Routes
app.use("/api/comments", commentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

// ────────────── Serve static frontend (Vite build output)
const distPath = path.join(__dirname, "client", "dist");
app.use(express.static(distPath));

// ────────────── Catch-all for client-side routing (FIXED)
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) return next();
  res.sendFile(path.join(distPath, "index.html"));
});

// ────────────── Error handler
app.use(errorHandler);

// ────────────── DB & Server Start
mongoose
.connect(process.env.MONGO_URI)
.then(() => {
  console.log("✅ MongoDB connected");
  server.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
  });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ────────────── Socket.io
io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });
});
