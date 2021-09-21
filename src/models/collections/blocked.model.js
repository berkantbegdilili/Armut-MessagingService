const mongoose = require('mongoose');

const mainSchema = mongoose.Schema({
    blockerId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
    blockedId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true }
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

const Blocked = mongoose.model("Blocked", mainSchema);

module.exports = {
    blockedSchema: mainSchema,
    Blocked
};