const mongoose = require("mongoose");

console.log("Starting MongoDB connection test...");
console.log("Node.js version:", process.version);
console.log("Mongoose version:", mongoose.version);

async function testConnection() {
  try {
    console.log("Attempting to connect to MongoDB...");

    // Enable mongoose debugging
    mongoose.set("debug", true);

    // Test connection with explicit options to avoid parsing issues
    await mongoose.connect("mongodb://localhost:27017/Leaderboard", {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB connected successfully!");

    // Test basic operations
    const testSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now },
    });

    const TestModel = mongoose.model("Test", testSchema);

    // Try to create a test document
    const testDoc = new TestModel({ name: "Connection Test" });
    await testDoc.save();
    console.log("✅ Test document created successfully!");

    // Clean up
    await TestModel.deleteOne({ name: "Connection Test" });
    console.log("✅ Test document deleted successfully!");

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error("Error message:", error.message);
    console.error("Error name:", error.name);
    console.error("Full error:", error);

    if (error.cause) {
      console.error("Error cause:", error.cause);
    }

    process.exit(1);
  }
}

testConnection();
