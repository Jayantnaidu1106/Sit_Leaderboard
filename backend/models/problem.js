const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    categories: [{ type: String }], // Array of category names (e.g., ['Arrays', 'Dynamic Programming'])
    description: { type: String, required: true },
    leetcodeLink: { type: String, required: true },
    totalSubmissions: { type: Number, default: 0 },
    successfulSubmissions: { type: Number, default: 0 }
}, { timestamps: true });

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;