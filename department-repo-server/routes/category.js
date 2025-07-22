const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const FileEntry = require("../models/FileEntry");

// GET all categories
router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// POST add category
router.post("/", async (req, res) => {
  const { name } = req.body;
  const newCat = new Category({ name });
  await newCat.save();
  res.json(newCat);
});

// PUT rename category
router.put("/:id", async (req, res) => {
  const { name } = req.body;
  const updated = await Category.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );
  res.json(updated);
});

// DELETE category + all files in it
router.delete("/:id", async (req, res) => {
  const categoryId = req.params.id;
  await FileEntry.deleteMany({ categoryId });
  await Category.findByIdAndDelete(categoryId);
  res.json({ msg: "Category and its files deleted" });
});

module.exports = router;
