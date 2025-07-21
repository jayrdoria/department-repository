const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  department: {
    type: String,
    enum: [
      "HR",
      "Tech",
      "VIP",
      "CS",
      "Acquisition",
      "Marketing",
      "Operations & Analytics",
      "Data Analyst",
      "Creatives",
    ],
    required: true,
  },
  role: { type: String, enum: ["admin", "department"], required: true },
});

module.exports = mongoose.model("User", userSchema);
