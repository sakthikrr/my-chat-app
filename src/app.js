const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas
console.log('Connecting to MongoDB Atlas...');

// Set up MongoDB connection options
const connectWithRetry = () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000 // Close sockets after 45s of inactivity
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully!');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Retrying connection in 5 seconds');
    setTimeout(connectWithRetry, 5000);
  });
};

connectWithRetry();

// Enable CORS for all routes
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
chatRoutes(app);

// API Documentation endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Chat API Server',
        version: '1.0.0',
        documentation: {
            messages: {
                collection: {
                    get: {
                        endpoint: '/api/messages',
                        description: 'Get all messages',
                        parameters: {
                            page: 'Page number for pagination (default: 1)',
                            limit: 'Number of messages per page (default: 20)',
                            sortBy: 'Field to sort by (default: timestamp)',
                            sortOrder: 'Sort order: asc or desc (default: desc)',
                            sender: 'Filter by sender name'
                        }
                    },
                    post: {
                        endpoint: '/api/messages',
                        description: 'Create a new message',
                        body: {
                            sender: 'Name of the message sender (required)',
                            content: 'Message content (required)'
                        }
                    }
                },
                singleItem: {
                    get: {
                        endpoint: '/api/messages/:id',
                        description: 'Get a single message by ID'
                    },
                    put: {
                        endpoint: '/api/messages/:id',
                        description: 'Update a message',
                        body: {
                            content: 'New message content (required)'
                        }
                    },
                    delete: {
                        endpoint: '/api/messages/:id',
                        description: 'Delete a message'
                    }
                }
            }
        }
    });
});

// 404 handler for undefined routes
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`Chat API Server is running on port ${PORT}`);
});