const db = require('../models');
const Blockeds = db.Blockeds;

exports.create = (req, res) => {
    const { blockerId, blockedId } = req.body;

    if (!blockerId)
        return res.status(400).send({ message: 'The blocker identifier cannot be left blank.' }); 

    if (!blockedId)
        return res.status(400).send({ message: 'The blocked identifier cannot be left blank.' });
        
    if (blockerId != req.userData._id)
        return res.status(403).send({ message: "You don't have permission to access." });
        
    const blocked = new Blockeds({
        blockerId: blockerId,
        blockedId: blockedId
    });

    blocked
    .save(blocked)
    .then((data) => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
}

exports.findAllWithBlockerId = (req, res) => {
    const { blockerId } = req.query;

    if (!blockerId)
        return res.status(400).send({ message: 'The blocker identifier cannot be left blank.' }); 

    if (blockerId != req.userData._id)
        return res.status(403).send({ message: "You don't have permission to access." });

    Blockeds
    .find({ blockerId: blockerId })
    .populate('blocker blocked')
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
}

exports.checkBlocked = (id1, id2) => {
    return Blockeds.find({ $or: [
        { blockerId: { $or: [id1,id2] } },
        { blockedId: { $or: [id1,id2] } }
    ]})
    .then(data => {
        if (!data)
            return { isBlocked: false }

        return { isBlocked: true }
    })
    .catch(err => {
        return { message: err.message };
    });
}