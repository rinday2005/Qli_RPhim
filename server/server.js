import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import seedAdmin from "./src/seed/seedAdmin.js";

dotenv.config();

const app = express();

// Connect DB
connectDB().then(() => {
  // Tạo superadmin nếu chưa có
  seedAdmin();
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
