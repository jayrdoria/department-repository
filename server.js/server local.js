const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Allow CORS
app.use(cors());
app.use(express.json());

// ✅ Prefix all routes with /department-repository/api
app.use("/department-repository/api/auth", require("./routes/auth"));

// ✅ Use PORT from .env
const PORT = process.env.PORT || 6060;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(
        `🚀 Server running on http://localhost:${PORT}/department-repository/api`
      );
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
