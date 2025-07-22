const mongoose = require("mongoose");
require("dotenv").config();

const FileEntry = require("./models/FileEntry");

const createTestFile = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const newFile = new FileEntry({
      title: "Marketing Strategy Q3",
      link: "https://example.com/marketing-strategy-q3.pdf",
      source: "Marketing Team",
      brand: "Stakes",
      remarks: "Official CRM campaign brief",
      isFile: false, // true if this was a real uploaded file path
      categoryId: "687f4ecb7f9d1be8ef4894a1", // 🟢 this is the Hey category
    });

    await newFile.save();
    console.log("✅ Test file created successfully");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating file:", err);
    process.exit(1);
  }
};

createTestFile();
