const db = require('../models');
const Users = db.Users;
const LoginLogs = db.LoginLogs;

exports.create = (req, res) => {
    const { username, password } = req.body;

    if (!username)
        return res.status(400).send({ message: 'The username cannot be left blank.' });

    if (!password)
        return res.status(400).send({ message: 'The password cannot be left blank.' });

    const user = new Users({ username: username, password: password });

    user
    .save(user)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({ message: err.message || "Some error occurred while creating the User." });
    });
};

exports.findOneWithUsername = async (username) => {
    return Users.findOne({ username: username })
    .select('-password')
    .then(data => data)
    .catch(err => err.message);
}

exports.pushConversation = async (userId, conversationId) => {
    return Users.findByIdAndUpdate(userId, {
        $push: { conversations: conversationId }
    })
    .then(() => {
        return { userId: userId, message: 'Conversation was append successfully.' };
    })
    .catch(err => {
        return { statusCode: 500, message: err.message };
    });
}

exports.getLoginLogs = (req, res) => {
    const { username } = req.params;

    if (username != req.userData.username)
        return res.status(403).send({ message: "You don't have permission to access."});

    LoginLogs
    .find({ userId: req.userData._id })
    .sort('-createdAt')
    .select('-userId -_id')
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
}