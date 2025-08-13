class ChatController {
    constructor(messageModel) {
        this.messageModel = messageModel;
    }

    async sendMessage(req, res) {
        try {
            const { sender, content } = req.body;
            
            // Validate required fields
            if (!sender || !content) {
                return res.status(400).json({ 
                    error: 'Missing required fields', 
                    requiredFields: ['sender', 'content'] 
                });
            }
            
            const message = await this.messageModel.create({
                sender,
                content
            });
            
            res.status(201).json({
                success: true,
                message: 'Message sent successfully',
                data: message
            });
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ 
                success: false,
                error: 'Failed to send message',
                details: error.message
            });
        }
    }

    async getMessages(req, res) {
        try {
            console.log('Retrieving messages');
            
            // Add pagination support
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const skip = (page - 1) * limit;
            
            // Add sorting options (default: newest first)
            const sortBy = req.query.sortBy || 'timestamp';
            const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
            const sortOptions = {};
            sortOptions[sortBy] = sortOrder;
            
            // Add filtering by sender
            const filter = {};
            if (req.query.sender) {
                filter.sender = req.query.sender;
            }
            
            // Create a promise with timeout to avoid serverless function timeouts
            const findMessagesWithTimeout = async () => {
                return Promise.race([
                    // The actual DB query
                    this.messageModel
                        .find(filter)
                        .sort(sortOptions)
                        .skip(skip)
                        .limit(limit)
                        .lean(), // Use lean() for better performance
                    
                    // A timeout promise
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Database query timed out after 8 seconds')), 8000)
                    )
                ]);
            };
            
            // Execute the query with timeout
            const messages = await findMessagesWithTimeout();
                
            // Get total count for pagination (with a simpler query that's less likely to timeout)
            const total = await this.messageModel.estimatedDocumentCount();
            
            // Return the data
            res.status(200).json({
                success: true,
                data: messages,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit)
                }
            });
            
            console.log('Successfully retrieved messages');
        } catch (error) {
            console.error('Error getting messages:', error);
            res.status(500).json({ 
                success: false,
                error: 'Failed to retrieve messages',
                details: error.message
            });
        }
    }
    
    async getMessageById(req, res) {
        try {
            const messageId = req.params.id;
            
            const message = await this.messageModel.findById(messageId);
            
            if (!message) {
                return res.status(404).json({
                    success: false,
                    error: 'Message not found'
                });
            }
            
            res.status(200).json({
                success: true,
                data: message
            });
        } catch (error) {
            console.error('Error getting message by ID:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to retrieve message',
                details: error.message
            });
        }
    }
    
    async deleteMessage(req, res) {
        try {
            const messageId = req.params.id;
            
            const message = await this.messageModel.findByIdAndDelete(messageId);
            
            if (!message) {
                return res.status(404).json({
                    success: false,
                    error: 'Message not found'
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'Message deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting message:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to delete message',
                details: error.message
            });
        }
    }
    
    async updateMessage(req, res) {
        try {
            const messageId = req.params.id;
            const { content } = req.body;
            
            if (!content) {
                return res.status(400).json({
                    success: false,
                    error: 'Content is required for update'
                });
            }
            
            const message = await this.messageModel.findByIdAndUpdate(
                messageId,
                { content, updatedAt: Date.now() },
                { new: true, runValidators: true }
            );
            
            if (!message) {
                return res.status(404).json({
                    success: false,
                    error: 'Message not found'
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'Message updated successfully',
                data: message
            });
        } catch (error) {
            console.error('Error updating message:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update message',
                details: error.message
            });
        }
    }
}

module.exports = ChatController;