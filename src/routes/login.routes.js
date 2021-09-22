module.exports = app => {
    const Auth = require("../controllers/auth.controller");

    var router = require("express").Router();

    router.post("/", Auth.login);

    app.use('/v1/login', router);
}