const express = require('express');
const router = express.Router();
const { authenticate, createRateLimiter, cache } = require('../utils/api');
const {
    getProblems,
    getProblemById,
    submitSolution,
    getUserSubmissions,
    getCategories
} = require('../controllers/contestController');

// Apply rate limiting to submissions
const submissionLimiter = createRateLimiter(60 * 1000, 10); // 10 submissions per minute

// Public routes with caching
router.get('/problems', cache(300), getProblems);
router.get('/problems/categories', cache(3600), getCategories);
router.get('/problems/:id', cache(300), getProblemById);

// Protected routes
router.use(authenticate);
router.post('/problems/:problemId/submit', submissionLimiter, submitSolution);
router.get('/submissions', getUserSubmissions);

module.exports = router;
