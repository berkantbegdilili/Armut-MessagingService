module.exports = app => {
    require('./auth.routes')(app);
    require('./user.routes')(app);
    require('./conversation.routes')(app);
    require('./message.routes')(app);
    require('./blocked.routes')(app);
}