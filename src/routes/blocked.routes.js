module.exports = app => {
    const Blockeds = require('../controllers/blocked.controller');
    const checkAuth = require('../controllers/auth.controller').checkAuth;

    var router = require("express").Router();

    router.get('/', checkAuth, Blockeds.findAllWithBlockerId);
    router.post('/', checkAuth, Blockeds.create);
    
    app.use('/v1/blockeds', router);
}