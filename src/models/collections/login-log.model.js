const mongoose = require('mongoose');

const mainSchema = mongoose.Schema({
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
    isSuccess: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now }
}, {
    versionKey: false,
    id: false,
    toJSON:{ 
        virtuals: true
    },
    toObject:{
        virtuals: true
    }
});

const LoginLog = mongoose.model("LoginLog", mainSchema);

module.exports = {
    loginLogSchema: mainSchema,
    LoginLog
};