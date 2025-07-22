const mongoose = require("mongoose");

const FileEntrySchema = new mongoose.Schema({
  title: String,
  link: String, // file path OR external link
  source: String,
  brand: String,
  remarks: String,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  isFile: Boolean,
});

module.exports = mongoose.model("FileEntry", FileEntrySchema);
