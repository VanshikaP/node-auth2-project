const bcrypt = require('bcryptjs');
const router = require("express").Router();
const jwt = require('jsonwebtoken');

const rounds = process.env.HASHING_ROUNDS || 8;
const Users = require("../users/users-model.js");
const secrets = require('./secrets.js');

router.post("/register", (req, res) => {
    const userInfo = req.body;

    // pwd will be hashed and re-hashed 2^8 times
    const hash = bcrypt.hashSync(userInfo.password, rounds);

    userInfo.password = hash;

    Users.add(userInfo)
        .then(user => {
            res.json(user);
        })
        .catch(err => res.send(err));
});

router.post("/login", (req, res) => {
    const { username, password} = req.body;

    Users.findBy({username})
        .then(([user]) => {
            if(user && bcrypt.compareSync(password, user.password)) {
                // remember this client
                // produce a token
                const token = generateToken(user);
                // send that token to client
                res.status(200).json(token);
            } else {
                res.status(401).json({ message: 'invalid credentials' });
            }
        })
        .catch(err =>{
            res.status(500).json({ message: 'error finding the user' });
        });
});

function generateToken(user) {
    const payload = {
        userId: user.id,
        username: user.username,
        department: user.department
    };
    const secret = secrets.jwtSecret;
    const options = {
        expiresIn: '1 day'
    };
    return jwt.sign(payload, secret, options);
}
module.exports = router;
