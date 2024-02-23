// messageRoutes.js
const express = require('express');
const MessageRouter = express.Router();
const messageController = require('../controllers/MessageController');

// Endpoint para crear un nuevo mensaje
MessageRouter.route('/')
    .post(messageController.createMessage)
    .get(messageController.getMessages);

MessageRouter.route('/:_id')
    .get(messageController.getMessageById)
    .delete(messageController.deleteMessages)
    .put(messageController.updateMessage);


module.exports = MessageRouter;
