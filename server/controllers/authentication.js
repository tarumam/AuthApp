const jwt = require('jwt-simple')
const config = require('../config')
const User = require('../models/user')

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({
        sub: user.id,
        iat: timestamp
    }, config.secret)
}

exports.signup = function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password)
        return res.status(422).send({ error: 'You must provide email and password' })
    //See if a user with the givem email exists
    User.findOne({ email: email }, function (err, existingUser) {

        //If a user with email does exists, return an error
        if (err) { return next(err); }

        if (existingUser) {
            return res.status(422).send({ error: 'Email is in use' })
        }

        //If a user with email does not exist, create and save user record
        const user = new User({
            email: email,
            password: password
        });
        user.save(function (err) {
            if (err) { return next(err); }

            //Respond to request indication the user was created
            res.json({ token: tokenForUser(user) })
        })
    })




}

exports.signin = function (req, res, next) {
    //User has alread had their email and password auth'd
    //Return a token to logged user
    res.send({ token: tokenForUser(req.user) })
}