const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    status: { type: String, enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error'], required: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
    runtime: { type: Number }, // in milliseconds
    memoryUsed: { type: Number }, // in KB
    isContestSubmission: { type: Boolean, default: false },
    contestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest' }
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;