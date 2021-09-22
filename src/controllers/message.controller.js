const db = require('../models');
const Messages = db.Messages;

const ConversationController = require('./conversation.controller');

exports.createWithSocket = (conversationId, userId, text) => {
    const message = new Messages({ 
        conversationId: conversationId,
        userId: userId,
        text: text
    });

    return message
    .save(message)
    .then(data => {
        ConversationController.updateLastMessage(conversationId, data._id)
        .then(data => data)
        .catch(err => err)
    })
    .catch(err => {
        return { statusCode: 500, message: err.message } ;
    });
};

exports.create = (req, res) => {
    const { conversationId, userId, text } = req.body;

    if (!conversationId)
        return res.status(400).send({ message: 'The conversation identifier cannot be left blank.' });

    if (!userId)
        return res.status(400).send({ message: 'The user identifier cannot be left blank.' });

    if (!text)
        return res.status(400).send({ message: 'The text cannot be left blank.' });

    const message = new Messages({ 
        conversationId: conversationId,
        userId: userId,
        text: text
    });

    message
    .save(message)
    .then(data => {
        ConversationController.updateLastMessage(conversationId, data._id)
        .then(data => res.send(data))
        .catch(err => res.status(err.statusCode).send({ message: err.message }))
    })
    .catch(err => res.status(500).send({ message: err.message }));
}

exports.findAllWithConversationId = (req, res) => {
    const { conversationId } = req.query; 

    if (!conversationId)
        return res.status(400).send({ message: 'The conversation identifier cannot be left blank.' });

    Messages.find({ conversationId: conversationId })
    .sort('-updatedAt')
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
}