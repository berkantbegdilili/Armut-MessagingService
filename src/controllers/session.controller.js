var session = require("express-session");
var parseurl = require('parseurl');
const db = require("../models");

const sessionMiddleware = session({
    name: "__sid",
    secret: process.env.SESSION_SECRET_KEY,
    store: db.redisSessionStore,
    resave: false,
    saveUninitialized: true,
    proxy: true,
    cookie: {
        httpOnly: true,
        secure: false,
        expires: 60 * 60 * 1000,
        sameSite: 'Lax'
    }
});

exports.setup = (app, io) => {
    app.use(sessionMiddleware);

    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res || {}, next);
    });
};

exports.pathname = (req, res, next) => {
    if (!req.session.views) {
        req.session.views = {}
    }
    var pathname = parseurl(req).pathname;
    req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;
    req.session.ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    
    next();
}