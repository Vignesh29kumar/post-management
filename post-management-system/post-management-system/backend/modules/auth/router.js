const router = require('express').Router();
const { register, login, logout, me } = require('./controller');
const { protect } = require('../../middleware/auth');
const rateLimit = require('express-rate-limit');

const loginLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false, message: { status: false, message: 'Too many login attempts. Try again later.' } });
router.post('/register', register);
router.post('/login', loginLimit, login);
router.post('/logout', logout);
router.get('/me', protect, me);
module.exports = router;
