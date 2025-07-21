const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign(
    { userId: user._id, role: user.role, department: user.department },
    process.env.JWT_SECRET
  );
  res.json({
    token,
    user: {
      _id: user._id,
      email: user.email,
      department: user.department,
      role: user.role,
    },
  });
});

// ✅ Add this route at the bottom of the file
router.get("/validate", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ valid: true, userId: decoded.userId });
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
});

module.exports = router;
