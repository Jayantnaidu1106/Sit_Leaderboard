const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    leetcodeusername: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: 'default-avatar.png' },
    score: { type: Number, default: 0 },
    contestScore: { type: Number, default: 0 },
    allTimeContestScore: { type: Number, default: 0 },
    contestRating: { type: Number, default: 1500 }, // ELO rating
    problemsSolved: {
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 }
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    contestDate: { type: Date }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;