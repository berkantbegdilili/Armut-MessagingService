module.exports = app => {
    const Users = require('../controllers/user.controller');
    const checkAuth = require('../controllers/auth.controller').checkAuth;

    var router = require('express').Router();

    router.get('/:username/loginLogs', checkAuth, Users.getLoginLogs);
    router.post('/', Users.create);
    
    app.use('/v1/users', router);
}
