// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import seedAdmin from "./src/seed/seedAdmin.js";
import authRoutes from "./src/routes/authRoutes.js";

// Middleware kiểm tra token/role
import { verifyToken, requireAdmin, requireSuperAdmin } from "./src/middlewares/authMiddleware.js";

dotenv.config();

const app = express();

// ===== Connect DB & Seed SuperAdmin =====
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected");
    seedAdmin(); // Tạo superadmin nếu chưa có
  })
  .catch(err => console.error("DB connection error:", err));

// ===== CORS configuration =====
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"], // FE development
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS','PATCH']
}));

// ===== Body parsing middleware =====
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== Debug middleware =====
app.use((req, res, next) => {
  console.log(`\n📥 ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Query:', req.query);
  next();
});

// ===== Default route =====
app.get("/", (req, res) => {
  res.json({
    message: "API is running...",
    status: "success",
    timestamp: new Date().toISOString()
  });
});

// ===== Health check =====
app.get("/api/health", (req, res) => {
  res.json({
    message: "Server is healthy",
    status: "success",
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000
  });
});

// ===== Auth routes =====
app.use("/api/auth", authRoutes);

// ===== Example protected routes =====
app.get("/api/admin/data", verifyToken, requireAdmin, (req, res) => {
  res.json({ msg: "Chỉ admin mới xem được" });
});
app.get("/api/superadmin/data", verifyToken, requireSuperAdmin, (req, res) => {
  res.json({ msg: "Chỉ superadmin mới xem được" });
});

// ===== Catch-all 404 (không dùng *) =====
app.use((req, res) => {
  res.status(404).json({ message: "Route not found", status: "fail" });
});

// ===== Start server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
