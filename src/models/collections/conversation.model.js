const mongoose = require('mongoose');

const mainSchema = mongoose.Schema({
    _id: { type: String, required: true },
    userId1: { type: mongoose.SchemaTypes.ObjectId, required: true },
    userId2: { type: mongoose.SchemaTypes.ObjectId, required: true },
    lastMessageId: { type: mongoose.SchemaTypes.ObjectId },
}, {
    timestamp: true,
    versionKey: false,
    id: false,
    toJSON:{ 
        virtuals: true
    },
    toObject:{
        virtuals: true
    }
});

const Conversation = mongoose.model("Conversation", mainSchema);

module.exports = {
    conversationSchema: mainSchema,
    Conversation
};