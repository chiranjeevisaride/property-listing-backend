const User = require('../models/user');
const {normalizeErrors} = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/dev');


exports.auth = function (req, res) {
    const {email, password} = req.body;

    if(!email || !password){
        return serverError(res, 422, 'Data missing!', 'Provide email and password');
    }

    User.findOne({email}, function (err, user) {
        if(err){
            return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        if(!user) {
            return serverError(res, 422, 'Invalid User!', 'User does not exist');
        } else {
            if(!user.isSamePassword(password)){
                return serverError(res, 422, 'Invalid Password!', 'Password is Incorrect');
            } else {
                const token = jwt.sign({
                    userId: user.id,
                    username: user.username,
                    email: user.email,
                  }, config.SECRET, { expiresIn: '1h' });
                return res.status(200).send({token});
            }
        }
    });
}



exports.register = function(req, res) {
    const {username, email, password, passwordConfirmation} = req.body;

    if(!username || !email) {
        return serverError(res, 422, 'Data missing!', 'Provide email and password');
    }

    if(password != passwordConfirmation){
        return serverError(res, 422, 'Invalid Password!', 'Password is not same as confirmation');
    }
    
    User.findOne({email}, function(err, existingUser) {
        if(err){
            return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        if(existingUser) {
            return serverError(res, 422, 'Invalid Email!', 'User with this email already exists');
        }

        const user = User({
            username,
            email,
            password
        });

        user.save(function(err){
            if(err){
                return res.status(422).send({errors: normalizeErrors(err.errors)});
            }
            return res.status(200).send({'registered': true});
        });
        
    });
}

exports.authMiddleware = function(req, res, next) {
    const token = req.headers.authorization;
    if(token){
         const user = parseToken(token);
         User.findById(user.userId, function(err, user) {
             if(user){
                res.locals.user = user;
                next();
             } else {
                return serverError(res, 401, 'Not Authorized!', 'You need to login to get access!');
             }
         });
    } else {
        return serverError(res, 401, 'Not Authorized!', 'You need to login to get access!');
     }
}



function serverError(res, statusCode, title, detail){
    return res.status(statusCode).send({errors: [{
        title: title,
        detail: detail}]
    });
}

function parseToken(token){
    console.log(token.split(' ')[1]);
    return jwt.verify(token.split(' ')[1], config.SECRET);
}