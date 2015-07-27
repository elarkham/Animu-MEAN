'use strict';

var User    = require('../models/user.server.model.js');
var jwt     = require('jsonwebtoken');
var config  = require('../../config');
var chalk   = require('chalk');

// secret for creating tokens
var secret = config.secret;

/**
 * Give token in response to valid user login.
 */
exports.giveToken = function(req, res) {
    console.log(chalk.blue('Someone is requesting a token.'));

     //only for development
     if (req.body.test === 'foobar') {
        var user = new User();
        user.name ='foobar';
        user.pasword = 'pasword';
        user.admin = true;

        //create token
        var token = jwt.sign(user, secret, {
            expiresInMinutes: 1440 //expire in 24 hours
        });

        var msg = 'Token created';
        console.log(chalk.green(msg + ': ' + token ));
        res.json({
            success: true,
            message: 'Token Created',
            token: token
        });

        return;

    }

    //find user
    User.findOne({
        username: req.body.username
    }).select('password admin').exec(function(err, user){

            var error;

            //throw error if something wron with search
            if(err) throw err;

            //if no user with the username found
            if(!user) {
               error = 'Authentication failed. User not found.';

                console.log(chalk.bold.red(error));
                res.json({
                    sucess: false,
                    message: error

                });

            //if no password
            }else if(!req.body.password){
                res.json({
                    success: false,
                    message: 'A password must be included.'
                });

            //if password doesn't match
            }else if (user) {

                var validPassword = user.comparePassword(req.body.password);
                if(!validPassword) {
                    error = 'Authentication failed. Wrong password.';

                    console.log(chalk.bold.red(error));
                    res.json({
                        success: false,
                        message: error });

                //username and password match
                } else {

                    //create token
                    var token = jwt.sign(user, secret, {
                        expiresInMinutes: 1440 //expire in 24 hours
                    });

                    var msg = 'Token created';
                    console.log(chalk.green(msg + ': ' + token ));
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
    console.log(chalk.blue(chalk.yellow('->0') + ' Someone is verifying their token.'));

    var token = req.body.token || req.headers['x-access-token'];

    if (token){
        //verifys token with secret
        jwt.verify(token, secret, function(err, decoded){
            if(err) {
                error = 'failed to authenticate token';
                console.log(chalk.bold.red(error));
                return res.json({succes: false, message: error});
            } else {
                //token valid
                req.decoded = decoded;
                console.log(chalk.green(chalk.yellow('->O') + ' Given token is valid.'));
                next(); //allows them to proceed
            }

        });
    } else {
        var error = 'No valid token found';
        console.log(chalk.bold.red(error));
        return res.status(403).send({
            success: false,
            message: error
        });
    }

};

