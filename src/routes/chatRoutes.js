const express = require('express');
const ChatController = require('../controllers/chatController');
const MessageModel = require('../models/messageModel');

const setChatRoutes = (app) => {
    const chatController = new ChatController(MessageModel);

    // Message collection endpoints
    app.post('/api/messages', chatController.sendMessage.bind(chatController));
    app.get('/api/messages', chatController.getMessages.bind(chatController));
    
    // Single message endpoints
    app.get('/api/messages/:id', chatController.getMessageById.bind(chatController));
    app.put('/api/messages/:id', chatController.updateMessage.bind(chatController));
    app.delete('/api/messages/:id', chatController.deleteMessage.bind(chatController));
};

module.exports = setChatRoutes;