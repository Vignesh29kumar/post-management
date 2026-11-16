const { registerUser, loginUser } = require('./services');
const { sendResponse } = require('../../common');

const register = async (req, res, next) => {
    try {
        console.log('Registering user with data:', req.body); // Log the request body for debugging
        const { name, email, password } = req.body;
    const img = req?.files? req?.files?.image : null;

        const registerData = {
            name: name,
            email: email,
            password: password,
        image: img,

        };
        const user = await registerUser(registerData);
        console.log('User registered successfully:', user); // Log the registered user for debugging
        return sendResponse(res, 201, true, 'Account created successfully', user);
    } catch (error) { next(error); }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log('Logging in user with email:', email); // Log the email for debugging
        if (!email || !password) {
            return sendResponse(res, 400, false, 'Email and password are required');
        }
        const { user, token } = await loginUser(email, password);
        console.log('Generated token:', user, token); // Log the generated token for debugging
        const loginData = {
            id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
            token: token
        };
        return sendResponse(res, 200, true, 'Login successful', loginData);
    } catch (error) { next(error); }
};

const logout = (req, res) => {
    return sendResponse(res, 200, true, 'Logged out successfully');
};

const me = (req, res) => sendResponse(res, 200, true, 'Current user', req.user);
module.exports = { register, login, logout, me };
