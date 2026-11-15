const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('../user/models/user.schema');

const createToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
});

const registerUser = async (body) => {
    console.log('Registering user with body:', body); // Log the request body for debugging
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    if (!name || !email || password.length < 8) {
        const error = new Error('Name, valid email and password (minimum 8 characters) are required');
        error.statusCode = 400;
        throw error;
    }
    if (await User.findOne({ email })) {
        const error = new Error('Email is already registered');
        error.statusCode = 409;
        throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    let userProfile=null;
     if(body?.image){
            const fileName = Date.now() + body?.image.name;
            const uploadPath = path.join(__dirname, '../../uploads', fileName);
             await body?.image.mv(uploadPath);
            userProfile = fileName;
        }
    return User.create({ name, email, password: hashedPassword, role: 'user', image: userProfile });
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email: String(email || '').toLowerCase().trim() }).select('+password');
    if (!user || !user.isActive || !(await bcrypt.compare(String(password || ''), user.password))) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }
    return { user, token: createToken(user._id) };
};

module.exports = { registerUser, loginUser };
