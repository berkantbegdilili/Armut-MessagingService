const db = require('../models');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const Users = db.Users;
const LoginLogs = db.LoginLogs;

exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username)
        return res.status(400).send({ message: 'The username cannot be left blank.' });

    if (!password)
        return res.status(400).send({ message: 'The password cannot be left blank.' });

    Users.findOne({ username: username })
    .then(user => {
        if (!user)
            return res.status(404).send({ message: 'User was not found!' });
  
        user.validatePassword(password)
        .then(isMatch => {
            if (!isMatch) {
                return LoginLogs.create({ userId: user._id, isSuccess: false })
                .then(() => res.status(400).send({ message: 'The password is invalid.' }))
                .catch(err => res.status(500).send({ message: err.message }));
            }

            const successLoginLog = new LoginLogs({ userId: user._id, isSuccess: true });

            var privateKeyBuffer = fs.readFileSync(__dirname + '/../keys/private.key');
            
            const data = JSON.stringify(user);

            var token = jwt.sign(
                data,
                privateKeyBuffer,
                { algorithm: 'RS256' },
                { expiresIn: '1h' }
            );

            return successLoginLog
            .save(successLoginLog)
            .then(() => res.status(200).send({ token: token }) )
            .catch(err => res.status(500).send({ message: err.message }));
            
        })
        .catch(err => res.status(500).send({ message: err.message }))
    })
    .catch(err => res.status(500).send({ message: err.message }))
};

exports.checkAuth = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        var publicKey = fs.readFileSync(__dirname + '/../keys/public.pem'); 

        jwt.verify(token, publicKey, { algorithms: ['RS256'] }, function (err, payload) {
            if (err)
                return res.status(401).send({
                    message: "Authorization failed."
                });
            
            req.userData = payload;
            next();
        });
    } catch(err) {
        return res.status(401).send({
            message: "Authorization failed."
        });
    }
}