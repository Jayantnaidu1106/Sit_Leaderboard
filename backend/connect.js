const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = "mongodb://localhost:27017/Leaderboard";
    if (!uri) {
      throw new Error("MONGO_URI is not defined in the environment variables.");
    }

    // Connect to MongoDB with explicit options to avoid parsing issues
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error("Full error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
