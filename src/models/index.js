const mongoose = require('mongoose');
const Redis = require("ioredis");

const db = {};

mongoose.Promise = global.Promise;

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

db.mongoose = mongoose;

// Collections
db.Users = require('./collections/user.model').User;
db.Conversations = require('./collections/conversation.model').Conversation;
db.Messages = require('./collections/message.model').Message;
db.Blockeds = require('./collections/blocked.model').Blocked;
db.LoginLogs = require('./collections/login-log.model').LoginLog;

module.exports = db;