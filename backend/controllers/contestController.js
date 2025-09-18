const Problem = require('../models/problem');
const Submission = require('../models/submission');
const { cache } = require('../utils/api');

// Get all problems with optional filtering
const getProblems = async (req, res) => {
    try {
        const { difficulty, category, search } = req.query;
        let query = {};

        if (difficulty) {
            query.difficulty = difficulty;
        }
        if (category) {
            query.categories = category;
        }
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const problems = await Problem.find(query);
        res.json(problems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get problem by ID with submission statistics
const getProblemById = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        // Get submission statistics for the problem
        const stats = await Submission.aggregate([
            { $match: { problem: problem._id } },
            { $group: {
                _id: '$status',
                count: { $sum: 1 }
            }}
        ]);

        res.json({ problem, stats });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Submit solution for a problem
const submitSolution = async (req, res) => {
    try {
        const { code, language } = req.body;
        const { problemId } = req.params;
        const userId = req.user.id;

        // Here you would typically:
        // 1. Run the code against test cases
        // 2. Check for correctness
        // 3. Measure runtime and memory usage
        // This is a simplified version

        const submission = new Submission({
            user: userId,
            problem: problemId,
            code,
            language,
            status: 'Accepted', // This should be determined by actual code execution
            runtime: 100, // Example value
            memoryUsed: 16384 // Example value
        });

        await submission.save();

        // Update problem statistics
        await Problem.findByIdAndUpdate(problemId, {
            $inc: {
                totalSubmissions: 1,
                successfulSubmissions: submission.status === 'Accepted' ? 1 : 0
            }
        });

        res.json({ status: 'success', submission });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get submission history for a user
const getUserSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ user: req.user.id })
            .populate('problem', 'title difficulty')
            .sort({ createdAt: -1 });

        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get problem categories with counts
const getCategories = async (req, res) => {
    try {
        const categories = await Problem.aggregate([
            { $unwind: '$categories' },
            { $group: {
                _id: '$categories',
                count: { $sum: 1 }
            }},
            { $sort: { count: -1 } }
        ]);

        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProblems,
    getProblemById,
    submitSolution,
    getUserSubmissions,
    getCategories
};
