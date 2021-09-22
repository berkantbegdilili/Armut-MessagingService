const mongoose = require('mongoose');
const Redis = require("ioredis");
var session = require("express-session");
var RedisStore = require('connect-redis')(session);
const { RateLimiterMemory, RateLimiterRedis } = require('rate-limiter-flexible');

const db = {};

// Mongodb
mongoose.Promise = global.Promise;

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

db.mongoose = mongoose;

// Redis
const redisClient = new Redis(
    { 
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        retryStrategy(times) {
            const delay = Math.min(times * 50, 2000);
            return delay;
        }
    }
);

db.redisClient = redisClient;

db.redisSessionStore = new RedisStore({
    prefix: 'session:', 
    client: redisClient,
    ttl: 60 * 60 * 1000 
});

const rateLimiterMemory = new RateLimiterMemory({
    points: 20,
    duration: 60
});

db.rateLimiterRedis = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rateLimiter',
    points: 100, 
    duration: 60,
    inmemoryBlockOnConsumed: 101,
    inmemoryBlockDuration: 60,
    insuranceLimiter: rateLimiterMemory 
});

db.limiterConsecutiveOutOfLimits = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'consecutiveOutOfLimits',
    points: 99999, 
    duration: 0
});

// Collections
db.Users = require('./collections/user.model').User;
db.Conversations = require('./collections/conversation.model').Conversation;
db.Messages = require('./collections/message.model').Message;
db.Blockeds = require('./collections/blocked.model').Blocked;
db.LoginLogs = require('./collections/login-log.model').LoginLog;

module.exports = db;