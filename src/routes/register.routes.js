module.exports = app => {
    const Users = require('../controllers/user.controller');

    var router = require('express').Router();

    router.post('/', Users.create);
    
    app.use('/v1/register', router);
}
