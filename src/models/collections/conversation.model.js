const mongoose = require('mongoose');

const mainSchema = mongoose.Schema({
    _id: { type: String, required: true },
    users: { type: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true }], default: [] },
    lastMessage: { type: mongoose.SchemaTypes.ObjectId, ref: 'Message' },
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

const Conversation = mongoose.model("Conversation", mainSchema);

module.exports = {
    conversationSchema: mainSchema,
    Conversation
};