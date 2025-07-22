const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const File = require("../models/FileEntry");

// GET /api/files?categoryId=...
router.get("/", async (req, res) => {
  const { categoryId } = req.query;

  if (!categoryId) {
    return res.status(400).json({ msg: "Missing categoryId" });
  }

  try {
    const files = await File.find({
      categoryId: new mongoose.Types.ObjectId(categoryId),
    });

    res.json(files);
  } catch (err) {
    console.error("❌ Error fetching files:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// PUT /api/files/:id — Update a file entry
router.put("/:id", async (req, res) => {
  try {
    const updated = await File.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ msg: "Update failed" });
  }
});

// ✅ DELETE /api/files/:id — Delete a file entry
router.delete("/:id", async (req, res) => {
  try {
    await File.findByIdAndDelete(req.params.id);
    res.json({ msg: "File deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ msg: "Delete failed" });
  }
});

module.exports = router;
