// backend/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');

const app = express();

// CORS Configuration
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Middleware
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add a root API route
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'ASYV LEAP API is running'
    });
});

// API Routes
app.use('/api', routes);

// Base route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to ASYV LEAP API' });
});

// 404 handler
app.use((req, res) => {
    console.log(`404 - Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 3001;

const startServer = (port) => {
    try {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
            console.log(`CORS enabled for: ${corsOptions.origin}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${port} is busy. Trying port ${port + 1}`);
                startServer(port + 1);
            } else {
                console.error('Server error:', err);
            }
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer(PORT);