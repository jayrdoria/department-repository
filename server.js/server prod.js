const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
require("dotenv").config();

const app = express();

// ✅ Load SSL certificates
const sslOptions = {
  key: fs.readFileSync(
    "/etc/letsencrypt/live/employee.netovation.eu/privkey.pem"
  ),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/employee.netovation.eu/fullchain.pem"
  ),
};

// ✅ CORS: allow only your domain
const allowedOrigins = ["https://employee.netovation.eu"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ Auth Route (Phase 1 only)
const authRoutes = require("./routes/auth");
app.use("/department-repository/api/auth", authRoutes);

// ✅ Fallback route
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// ✅ Start server
const PORT = process.env.PORT || 6060;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`🚀 Server running at https://employee.netovation.eu:${PORT}`);
});
