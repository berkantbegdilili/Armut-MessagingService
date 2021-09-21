const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const mainSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    conversations: { type: [ { type: String, ref: 'Conversation'} ] , default: [] }
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

mainSchema.pre('save', async function save(next) {
    if (!this.isModified('password')) return next();
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      return next();
    } catch (err) {
      return next(err);
    }
});

mainSchema.methods.validatePassword = async function validatePassword(data) {
    return bcrypt.compare(data, this.password);
};

const User = mongoose.model("User", mainSchema);

module.exports = {
    userSchema: mainSchema,
    User
};