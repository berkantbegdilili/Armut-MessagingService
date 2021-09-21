const mongoose = require('mongoose');

const mainSchema = mongoose.Schema({
    conversationId: { type: String, ref: 'Conversation', required: true },
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true }
}, {
    timestamps: true,
    versionKey: false,
    id: false,
    toJSON:{ 
        virtuals: true
    },
    toObject:{
        virtuals: true
    }
});

mainSchema.index({ text: 'text', conversationId: 1, userId: 1 });

const Message = mongoose.model("Message", mainSchema);

module.exports = {
    messageSchema: mainSchema,
    Message
};