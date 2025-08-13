# Chat API

A RESTful API for chat messaging built with Node.js, Express, and MongoDB Atlas.

## Features

- **MongoDB Atlas Integration**: Cloud-based database storage for chat messages
- **RESTful API Design**: Modern API architecture with proper HTTP methods
- **Pagination & Filtering**: Support for paginated results and filtering by sender
- **CORS Support**: Ready for cross-origin requests from web applications
- **Comprehensive Error Handling**: Detailed error responses with appropriate status codes

## API Endpoints

### Messages Collection

#### GET /api/messages
Get all messages with filtering and pagination

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `sortBy`: Field to sort by (default: timestamp)
- `sortOrder`: Sort direction - 'asc' or 'desc' (default: desc)
- `sender`: Filter by sender name

#### POST /api/messages
Create a new message

Request Body:
```json
{
  "sender": "User Name",
  "content": "Message content goes here"
}
```

### Single Message Operations

#### GET /api/messages/:id
Get a specific message by its ID

#### PUT /api/messages/:id
Update a message's content

Request Body:
```json
{
  "content": "Updated message content"
}
```

#### DELETE /api/messages/:id
Delete a specific message

## Project Structure

```
my-chat-app
├── src
│   ├── app.js                # Entry point of the application
│   ├── controllers           # Contains the chat controller
│   │   └── chatController.js  # Handles chat message operations
│   ├── models                # Contains the data models
│   │   └── messageModel.js    # Defines the structure of a chat message
│   └── routes                # Contains the route definitions
│       └── chatRoutes.js     # Defines the API endpoints

## Technology Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- CORS

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm start
   ```

## Environment Variables

- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Application environment (development/production)

## License

MIT
│   ├── routes                # Contains the route definitions
│   │   └── chatRoutes.js      # Sets up chat-related routes
│   └── views                 # Contains the front-end views
│       └── index.html         # HTML structure for the chat application
├── package.json              # npm configuration file
├── .env                      # Environment variables
├── .gitignore                # Files to ignore in Git
└── README.md                 # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/my-chat-app.git
   ```

2. Navigate to the project directory:
   ```
   cd my-chat-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your environment variables.

## Usage

1. Start the application:
   ```
   npm start
   ```

2. Open your browser and go to `http://localhost:3000` to access the chat application.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes. 

## License

This project is licensed under the MIT License.