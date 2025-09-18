

const User = require('../models/user');  // Import the user model
const {LeetCode} = require("leetcode-query");


const leetcode = new LeetCode();
async function add_user(req, res) {
    const { name, email, leetcodeusername } = req.body;

    if (!name || !email || !leetcodeusername) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Validate the LeetCode username
        const userData = await leetcode.User(leetcodeusername);
        if (!userData) {
            return res.status(400).json({ error: 'Invalid LeetCode username' });
        }

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Save the user to the database
        const newUser = new User({ name, email, leetcodeusername });
        await newUser.save();

        res.status(201).json({ message: 'User added successfully', user: newUser });
    } catch (error) {
        console.error('Error:', error.message);
        if (error.message.includes('not found')) {
            return res.status(400).json({ error: 'Invalid LeetCode username' });
        }
        res.status(500).json({ error: 'Server error' });
    }
}




async function delete_user(req,res){
    const {username} = req.params;

    if(!username){
        return res.status(400).json({ error: "Username required" });
    }

    try {
        const deluser = await user.findOneAndDelete({ leetcodeusername: username });

        if (!deluser) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).send("User deleted successfully");
    } catch (error) {
        console.error(error); 
        return res.status(500).send("Error deleting user");
    }

}
module.exports = {
    add_user,
    delete_user,
}
