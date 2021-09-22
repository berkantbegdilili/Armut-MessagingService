const db = require('./models');
const BlockedController = require('./controllers/blocked.controller');
const MessageController = require('./controllers/message.controller');

const messageHandler = (username, text) => {
    return {
        username,
        text,
        time: new Date()
    }
};

module.exports = io => {
    io.on('connection', socket => {
        if (socket.request.session.user === undefined) 
            return
          
        socket.on('joinConversation', conversationId => {
            const user = {
                socketId: socket.id,
                userId: socket.request.session.user._id,
                username: socket.request.session.user.username,
                conversationId: conversationId
            };

            db.redisClient.sadd("activeUsers", JSON.stringify(user));
            
            socket.join(conversationId);
        });
      
        socket.on('chatMessage', text => {
            let user = {};
            
            db.redisClient.smembers("activeUsers")
            .then(data => {
                const indexOf = data.indexOf("socket.id");

                if (indexOf == -1)
                    return
                
                user = data[indexOf];
            })
      
            if (user == {})
                return

            let parsedUser = JSON.parse(user);
            let userIds = parsedUser.conversationId.split('_');
            let { isBlocked } = BlockedController.checkBlocked(userIds[0], userIds[1]);

            if (isBlocked == undefined || isBlocked == true)
                return

            io.to(parsedUser.conversationId).emit('message', messageHandler(parsedUser.username, text));
            MessageController.createWithSocket(parsedUser.conversationId, parsedUser._id, text);
        });
      });
}