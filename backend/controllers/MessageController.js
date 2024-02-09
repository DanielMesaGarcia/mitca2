// messageController.js
const Message = require('../models/Message');

// Controlador para guardar un nuevo mensaje
const createMessage = async (req, res) => {
  try {
    const { sender, message } = req.body;
    const newMessage = new Message({ sender, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para obtener todos los mensajes
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteMessages = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params._id);
    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    // Obtener los mensajes actualizados después de eliminar el mensaje
    getMessages(req, res);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



module.exports = {
  createMessage,
  getMessages,
  deleteMessages,
};
