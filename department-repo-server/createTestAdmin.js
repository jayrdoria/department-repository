const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const existing = await User.findOne({ email: "admin@netovation.eu" });
    if (existing) {
      console.log("⚠️ Admin user already exists");
      return process.exit(0);
    }

    const passwordHash = await bcrypt.hash("Admin123!", 10); // 🔐 Change this later

    const newAdmin = new User({
      email: "admin@netovation.eu",
      passwordHash,
      department: "HR", // ✅ Can be any, just for placeholder
      role: "admin",
    });

    await newAdmin.save();
    console.log("✅ Admin user created successfully");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();
