const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(6060, () => {
      console.log("🚀 Server running on http://localhost:6060");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
