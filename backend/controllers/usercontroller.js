const User = require('../models/user');  // Import the user model
const { LeetCode } = require("leetcode-query");
const bcrypt = require('bcryptjs');
const axios = require('axios');

const leetcode = new LeetCode();

async function add_user(req, res) {
    console.log('Received registration request:', { ...req.body, password: '***' });
    const { name, email, leetcodeusername, password } = req.body;

    if (!name || !email || !leetcodeusername || !password) {
        console.log('Missing required fields');
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if the username is already registered first
        console.log('Checking if user exists:', leetcodeusername);
        const existingUser = await User.findOne({ username: leetcodeusername });
        if (existingUser) {
            console.log('Username already exists:', leetcodeusername);
            return res.status(400).json({ error: 'Username is already registered' });
        }

        // Fetch user data from LeetCode
        console.log('Fetching LeetCode user data for:', leetcodeusername);
        try {
            const userData = await leetcode.user(leetcodeusername);
            if (!userData || !userData.matchedUser) {
                console.log('Invalid LeetCode username:', leetcodeusername);
                return res.status(400).json({ error: 'Invalid LeetCode username' });
            }

            console.log('LeetCode data fetched successfully');
            const totalSolved = userData.matchedUser.submitStats.acSubmissionNum.find(stat => stat.difficulty === 'All').count;
            
            // Fetch contest data
            console.log('Fetching contest data');
            const contestData = await leetcode.user_contest_info(leetcodeusername);
            const allTimeContestScore = contestData && contestData.userContestRanking && contestData.userContestRanking.rating 
                ? contestData.userContestRanking.rating 
                : 0;

            console.log('Hashing password');
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Save the user to the database
            console.log('Creating new user');
            const newUser = new User({
                name,
                email,
                leetcodeusername,
                username: leetcodeusername,
                password: hashedPassword,
                score: totalSolved,
                allTimeContestScore,
                contestDate: new Date()
            });

            console.log('Saving user to database');
            await newUser.save();
            console.log('User saved successfully');

            const userResponse = { ...newUser.toObject() };
            delete userResponse.password;
            res.status(201).json({ message: 'User added successfully', user: userResponse });
        } catch (leetCodeError) {
            console.error('LeetCode API Error:', leetCodeError);
            return res.status(400).json({ error: 'Failed to fetch LeetCode data. Please try again later.' });
        }
    } catch (error) {
        console.error('Server Error:', error);
        console.error('Error Stack:', error.stack);
        res.status(500).json({ 
            error: 'Server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

async function delete_user(req, res) {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ error: "Username required" });
    }

    try {
        const deluser = await User.findOneAndDelete({ username });

        if (!deluser) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).send("User deleted successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error deleting user");
    }
}

async function get_leaderboard(req, res) {
    try {
        const users = await User.find().sort({ score: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching leaderboard:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
}

async function get_contest_leaderboard(req, res) {
    try {
        const currentWeek = new Date();
        currentWeek.setHours(0, 0, 0, 0);
        currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay());
        const users = await User.find({ contestDate: { $gte: currentWeek } }).sort({ allTimeContestScore: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching contest leaderboard:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
}

async function get_all_time_contest_leaderboard(req, res) {
    try {
        const users = await User.find().sort({ allTimeContestScore: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching all-time contest leaderboard:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    add_user,
    delete_user,
    get_leaderboard,
    get_contest_leaderboard,
    get_all_time_contest_leaderboard,
}
