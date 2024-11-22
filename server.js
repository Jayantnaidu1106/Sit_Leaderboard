require('dotenv').config();

const express = require('express');
const axios = require('axios'); // Axios is imported but was missing in your code
const { LeetCode } = require("leetcode-query"); // Fixed mixed `require` and `import` syntax
const cors = require('cors');
const userRoutes = require("./routes/user");
const { urlencoded } = require('body-parser');
const connectDB = require('./connect');
const path = require('path');

const app = express();
const leetcode = new LeetCode(); // Initialize LeetCode instance

// Middleware setup
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "../frontend/user/public"))); // Corrected static file path
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// API to fetch data (example for an external API)
app.get('/api/fetch-data', async (req, res) => {
    try {
        const response = await axios.get('https://www.npmjs.com/package/leetcode-query'); // Replace with the actual API URL
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// API to fetch LeetCode user data
app.get('/api/leetcode-user', async (req, res) => {
    try {
        const username = req.query.username; // Use query parameter for username
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }
        const userData = await leetcode.user(username);
        res.status(200).json(userData);
    } catch (error) {
        console.error('Error fetching LeetCode data:', error.message);
        res.status(500).json({ error: 'Failed to fetch LeetCode user data' });
    }
});

// Routes
app.use("/", userRoutes);

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
