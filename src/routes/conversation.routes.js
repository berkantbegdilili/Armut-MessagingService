module.exports = app => {
    const Conversations = require('../controllers/conversation.controller');
    const checkAuth = require('../controllers/auth.controller').checkAuth;

    var router = require("express").Router();

    router.get('/', checkAuth, Conversations.findAllWithUserId);
    router.post('/', checkAuth, Conversations.create);
    
    app.use('/v1/conversations', router);
}
