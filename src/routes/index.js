module.exports = app => {
    require('./register.routes')(app);
    require('./login.routes')(app);
    require('./user.routes')(app);
    require('./conversation.routes')(app);
    require('./message.routes')(app);
    require('./blocked.routes')(app);
}