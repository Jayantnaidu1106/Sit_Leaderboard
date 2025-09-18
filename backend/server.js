require("dotenv").config();

const express = require("express");
const axios = require("axios"); // Axios is imported but was missing in your code
const { LeetCode } = require("leetcode-query"); // Fixed mixed `require` and `import` syntax
const cors = require("cors");
const userRoutes = require("./routes/user");
const { urlencoded } = require("body-parser");
const connectDB = require("./connect");
const path = require("path");

const app = express();
const leetcode = new LeetCode(); // Initialize LeetCode instance

// Middleware setup
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true
}));

// Body parsing middleware
app.use(express.json({
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
      throw new Error('Invalid JSON');
    }
  }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend/user/public")));

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();

    // Debug middleware to log all requests
    app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      console.log('Request Body:', req.body);
      next();
    });

    // Routes
    app.use("/", userRoutes);

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Error:', err);
      console.error('Stack:', err.stack);
      res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    });

    // Server setup
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
