const mongoose = require('mongoose');

const db = {};

mongoose.Promise = global.Promise;

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

db.mongoose = mongoose;

module.exports = db;