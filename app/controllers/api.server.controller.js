'use strict';

var User    = require('../models/user.server.model.js');
var jwt     = require('jsonwebtoken');
var config  = require('../../config');

// secret for creating tokens
var secret = config.secret;

/**
 * Give token in response to valid user login.
 */
exports.giveToken = function(req, res) {

    //find user
    User.findOne({
        username: req.body.username
    }).select('password').exec(function(err, user){

            //throw error if something wron with search
            if(err) throw err;

            //if no user with the username found
            if(!user) {

                res.json({
                    sucess: false,
                    message:'Authentication failed. User not found.'

                })

            //if password doesn't match
            } else if (user) {

                var validPassword = user.comparePassword(req.body.password);
                if(!validPassword) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });

                //username and password match
                } else {

                    //create token
                    var token = jwt.sign(user, secret, {
                        expiresInMinutes: 1440 //expire in 24 hours
                    });

                    res.json({
                        success: true,
                        message: 'Token Created',
                        token: token
                    });

                }
            }

    });

};

/**
 * Verify valid token was given.
 */
exports.verifyToken = function(req, res, next) {
    console.log("Somebody is using the api")
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];

    if (token){
        //verifys token with secret
        jwt.verify(token, secret, function(err, decoded){
            if(err) {
                return res.json({succes:false, message:'failed to authenticate token'});
            } else {
                req.decoded = decoded;
                next(); //allows them to proceed
            }

        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'Found no valid token'
        });
    }

};

