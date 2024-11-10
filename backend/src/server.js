// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const routes = require('./routes');

// const app = express();

// // CORS Configuration
// const corsOptions = {
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
// };

// // Middleware
// app.use(cors(corsOptions));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // API Routes
// app.use('/api', routes);

// // Test route
// app.get('/', (req, res) => {
//     res.json({ message: 'Welcome to ASYV LEAP API' });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({
//         success: false,
//         message: 'Internal server error',
//         error: process.env.NODE_ENV === 'development' ? err.message : {}
//     });
// });

// const PORT = process.env.PORT || 3001;

// // Start server
// app.listen(PORT, () => {
//     console.log('Server is running on port ' + PORT);
//     console.log('Environment: ' + process.env.NODE_ENV);
//     console.log('CORS enabled for: ' + corsOptions.origin);
// });


require('dotenv').config();
const express = require('express');
const cors = require('cors');
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
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', routes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to ASYV LEAP API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 3001;

// Function to start server
const startServer = (port) => {
    try {
        app.listen(port, () => {
            console.log('Server is running on port ' + port);
            console.log('Environment: ' + process.env.NODE_ENV);
            console.log('CORS enabled for: ' + corsOptions.origin);
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

// Start the server
startServer(PORT);