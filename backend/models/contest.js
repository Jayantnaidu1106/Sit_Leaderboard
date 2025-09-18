const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    type: { type: String, enum: ['Weekly', 'Monthly', 'Special'], required: true },
    problems: [{
        problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
        points: { type: Number, required: true }
    }],
    participants: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        score: { type: Number, default: 0 },
        rank: { type: Number },
        ratingChange: { type: Number, default: 0 }
    }],
    isActive: { type: Boolean, default: false }
}, { timestamps: true });

const UserContest = mongoose.model('User', contestSchema);

module.exports = UserContest;