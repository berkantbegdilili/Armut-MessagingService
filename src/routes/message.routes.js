module.exports = app => {
    const Messages = require('../controllers/message.controller');
    const checkAuth = require('../controllers/auth.controller').checkAuth;

    var router = require("express").Router();

    router.get('/', checkAuth, Messages.findAllWithConversationId);
    router.post('/', checkAuth, Messages.create);
    
    app.use('/v1/messages', router);
}
