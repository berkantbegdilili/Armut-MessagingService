const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const mainSchema = mongoose.Schema({
    conversationId: { type: String, ref: 'Conversation', required: true },
    userId: { type: mongoose.SchemaTypes.ObjectId, required: true },
    text: { type: String, required: true }
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

mainSchema.index({ text: 'text', chatId: 1, userId: 1 });

mainSchema.pre('save', async function save(next) {
    if (!this.isModified('text')) return next();
    try {
      const salt = await bcrypt.genSalt(10);
      this.text = await bcrypt.hash(this.text, salt);
      return next();
    } catch (err) {
      return next(err);
    }
});

mainSchema.methods.validateText = async function validateText(data) {
    return bcrypt.compare(data, this.text);
};

const Message = mongoose.model("Message", mainSchema);

module.exports = {
    messageSchema: mainSchema,
    Message
};