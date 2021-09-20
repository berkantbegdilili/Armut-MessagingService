const db = require('../models');
const Users = db.Users;

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