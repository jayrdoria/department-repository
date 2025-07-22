const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const createDepartmentUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const email = "marketing@netovation.eu";
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("⚠️ Department user already exists");
      return process.exit(0);
    }

    const passwordHash = await bcrypt.hash("Marketing123!", 10);

    const newUser = new User({
      email,
      passwordHash,
      department: "Marketing", // 👈 Or Tech, CS, Acquisition, etc.
      role: "department",
    });

    await newUser.save();
    console.log("✅ Department user created successfully");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating department user:", err);
    process.exit(1);
  }
};

createDepartmentUser();
