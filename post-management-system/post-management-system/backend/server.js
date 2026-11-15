require('dotenv').config();

const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const routes = require('./routes/routes');
const { sendResponse } = require('./common');

const app = express();
const PORT = process.env.PORT || 8000;
console.log("env", process.env.CLIENT_URL)
const uploadPath = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}
// CORS configuration
app.use(cors({
    origin: [process.env.CLIENT_URL, "http://localhost:8000/uploads"],
    credentials: true
}));

app.use(helmet({
    crossOriginResourcePolicy: {
        policy: 'cross-origin'
    }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cookieParser());

// Static files
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/health', (req, res) => {
    console.log('Health check endpoint hit'); // Log when the health check endpoint is accessed
    return sendResponse(res, 200, true, 'API is running');
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
    return sendResponse(res, 404, false, 'Route not found');
});

// Error handler
app.use((error, req, res, next) => {
    console.error(error);

    const status = error.statusCode ||
        (error.name === 'ValidationError' ? 400 : 500);

    return sendResponse(
        res,
        status,
        false,
        status === 500 ? 'Something went wrong' : error.message
    );
});

// Start server
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
};

startServer();