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

// MongoDB connection state tracking
let isConnected = false;

// Set up MongoDB connection with optimizations for serverless
const connectToDatabase = async () => {
  // If we're already connected, return the existing connection
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    // Connection options optimized for serverless environment
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Increase these timeouts for better reliability
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 60000,
      // Keep connections alive to avoid cold starts in serverless
      keepAlive: true,
      connectTimeoutMS: 30000,
      // Reduce buffering time to avoid timeouts
      bufferCommands: false, 
      bufferMaxEntries: 0
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    isConnected = true;
    console.log('Connected to MongoDB Atlas successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    isConnected = false;
    // In serverless, we don't want to retry automatically
    throw err;
  }
};

// Connect to MongoDB
connectToDatabase().catch(err => console.error('Initial MongoDB connection failed:', err));

// Enable CORS for all routes
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
chatRoutes(app);

// Health check endpoint - useful for Vercel to verify deployment
app.get('/api/health', async (req, res) => {
    try {
        // Check MongoDB connection by running a simple query
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        
        // Return status information
        res.status(200).json({
            status: 'ok',
            timestamp: new Date(),
            environment: process.env.NODE_ENV,
            database: {
                status: dbStatus
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// API Documentation endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Chat API Server',
        version: '1.0.0',
        status: {
            health: '/api/health'
        },
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