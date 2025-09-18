const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const Redis = require('ioredis');

// Initialize Redis client for caching
const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
});

// Rate limiting middleware
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
    return rateLimit({
        windowMs,
        max,
        message: { error: 'Too many requests, please try again later.' }
    });
};

// Authentication middleware
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Caching middleware
const cache = (duration) => {
    return async (req, res, next) => {
        const key = `cache:${req.originalUrl}`;
        
        try {
            const cachedResponse = await redis.get(key);
            if (cachedResponse) {
                return res.json(JSON.parse(cachedResponse));
            }

            res.originalJson = res.json;
            res.json = (body) => {
                redis.setex(key, duration, JSON.stringify(body));
                res.originalJson(body);
            };
            next();
        } catch (error) {
            console.error('Cache error:', error);
            next();
        }
    };
};

module.exports = {
    createRateLimiter,
    authenticate,
    cache,
    redis
};
