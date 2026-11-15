const jwt = require('jsonwebtoken');
const { sendResponse } = require('../common');
const User = require('../modules/user/models/user.schema');

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log('Authorization header:', authHeader); // Log the authorization header for debugging
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : null;

        if (!token) {
            return sendResponse(res, 401, false, 'Please login to continue');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Log the decoded token for debugging
        const user = await User.findById(decoded.id).select('-password');
        console.log('Decoded user:', user); // Log the decoded user for debugging
        if (!user || !user.isActive) {
            return sendResponse(res, 401, false, 'Account is unavailable');
        }

        req.user = user;

        next();

    } catch (error) {
        return sendResponse(res, 401, false, 'Invalid or expired session');
    }
};

const allowRoles = (...roles) => (req, res, next) => {
    console.log('User role:', req.user, ...roles); // Log the user's role for debugging
    if (!req.user || !roles.includes(req.user.role)) {
        console.log('Access denied for user:', req.user); // Log access denial for debugging
        return sendResponse(res, 403, false, 'You do not have permission to perform this action');
    }
    next();
};

module.exports = { protect, allowRoles };
