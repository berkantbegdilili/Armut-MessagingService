const db = require('../models');
const Conversations = db.Conversations;

const UserController = require('./user.controller');


const generateConversation = (req, userId) => {
    const userIds = [req.userData._id, userId];
    const sorted = userIds.sort();
    const joined = sorted.join('_');
    return { id: joined, list: sorted };
}

const checkConversation = (id) => {
    return Conversations.findById(id)
    .then(data => {
        if (!data)
            return { isExists: false };

        return { isExists: true };
    })
    .catch(err => { 
        return { message: err.message }
    });
}

const pushConversations = (conversation) => {
    let promises = [];

    for (user of conversation.users) {
        promises.push(UserController.pushConversation(user, conversation._id));
    }

    return Promise.all(promises);
}

exports.create = async (req, res) => {
    const { username } = req.body;

    if (!username)
        return res.status(400).send({ message: 'The username cannot be left blank.' });

    if (req.userData.username == username)
        return res.status(400).send({ message: 'You cannot create a conversation with yourself.' });


    UserController.findOneWithUsername(username)
        .then(async (data) => {
            const genConversation = generateConversation(req, data._id);

            const { isExists } = await checkConversation(genConversation.id);

            if (isExists)
                return res.status(400).send({ message: 'The conversation already exists.' });

            const conversation = new Conversations({ 
                _id: genConversation.id, 
                users: genConversation.list
            });

            conversation
            .save(conversation)
            .then(data => {
                const pushed = pushConversations(data);
            
                pushed
                    .then(data => {
                        return res.send(data);
                    })
                    .catch(err => {
                        return res.status(err.statusCode).send({ message: err.message });
                    })
            })
            .catch(err => res.status(500).send({ message: err.message }));
    })
}

exports.findAllWithUserId = (req, res) => {
    const { userId } = req.query; 

    if (!userId)
        return res.status(400).send({ message: 'The user identifier cannot be left blank.' });

    if (userId != req.userData._id)
        return res.status(403).send({ message: "You don't have permission to access."});

    Conversations.find({ _id: { $regex: new RegExp(userId), $options: "i" } })
    .populate('lastMessage')
    .sort('-updatedAt')
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
}

exports.updateLastMessage = (conversationId, messageId) => {
    return Conversations
    .findByIdAndUpdate(conversationId, { lastMessage: messageId })
    .then(() => { 
        return { message: 'Message was sent successfully.' };
    })
    .catch(err => { 
        return { statusCode: 500, message: err.message } ;
    });
}