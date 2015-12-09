'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var User  = require('../models/user.server.model.js');
//var Show  = require('../models/show.server.model.js');
//var Media = require('../models/media.server.model.js');
var chalk = require('chalk');
var async = require('async');
var ObjectId = require('mongoose').Types.ObjectId;

/**
 * Create a User
 */
exports.create = function(req, res) {
    console.log(chalk.blue('Creating new user'));

    var error;

    // if a username isn't included
    if (!req.body.username) {
        error = 'You must include a username';
        res.json({success: 'false', message: error});
        console.log(chalk.bold.red('Error: ' + error));
        return;
    }

    // if a password isn't included
    if (!req.body.password) {
        error = 'You must include a password';
        res.json({success: false, message: error});
        console.log(chalk.bold.red('Error: ' + error));
        return;
    }

    var user      = new User();
    user.name     = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;

    user.save(function(err, user) {
        if (err) {
            // duplicate entry
            if (err.code === 11000) {
                error = 'Error: That username already exists';
                console.log(chalk.bold.red(error));
                return res.json({ success: false, message: error }); }
            else
                return res.send(err);
        }

        // return a message
        res.json({ success: true, message: 'User created!' });
        console.log(chalk.green('Created User: '+ user.name));
    });
};

/**
 * Show the current User
 */
exports.read = function(req, res) {
    console.log(chalk.blue('Getting user with id:' + req.params.user_id));
    User.findById(req.params.user_id, function(err, user) {

        //Check if user actually exists
        if (!user){
            var error = 'User with that id does not exist.';
            res.json({succes: false, message: error});
            console.log(chalk.bold.red('Error: ' + error));
        }

        else if (err) res.send(err);

        // return that user
        else {
            console.log(chalk.green('Returning user: \'' + user.username + '\''));
            res.json(user);
        }
    });
};

/**
 * Update a User
 */
exports.update = function(req, res) {
    console.log(chalk.blue('Updating user username:' + req.params.username));
    var error;

    async.waterfall([
        function( callback ){
            if ( !req.params.user_id ){
                error = new Error('No parameter')
            }

            User.findById(req.params.user_id, function(err, user) {
                // if user does not exist
                if (!user) {
                    var error = 'User with that id does not exist.';
                    res.json({ success: false, message: error});
                    console.log(chalk.bold.red('Error: ' + error));
                    return;
                }

                // for when something I didnt forsee happens.
                if (err)  {
                    res.send(err);
                    return;
                }

                // login information
                if ( req.body.name )          user.name     = req.body.name;
                if ( req.body.username )      user.username = req.body.username;
                if ( req.body.password )      user.password = req.body.password;

                // update what shows user has watched
                if ( req.body.watched_shows ) user.watched_shows = req.body.watched_shows;
                if ( req.body.watched_media ) user.watched_media = req.body.watched_media;

                // only an admin can modify this attribute
                if (req.body.admin){
                    if (req.decoded.admin === true ) {
                        user.admin = req.body.admin;
                    }
                }

                callback(err,user);
            });
        },
        function( user, callback ) {
            user.save( function(err) {
                // duplicate entry
                if ( err && err.code === 11000 ) {
                    error = new Error('User with that name already exists.');
                    return callback( error, null );
                }
                callback(err,user);
            });
        }
    ], complete);

    function complete( err, user ){
        var msg;
        if (err){
            msg = err.message;
            console.log( chalk.red.bold( msg ) );
            return res.json({ success: false, message: msg });
        }
        msg = 'Update Successfull!';
        return res.json({ success: true, message: msg });
    }
};

/**
 * Delete an User
 */
exports.delete = function(req, res) {
    console.log(chalk.blue('Deleting user with id:' + req.params.user_id));
    User.remove({ _id: req.params.user_id}, function(err) {

        // something I didnt forsee happened
        if (err) res.send(err);

        // inform deletion was success
        else {
            var success = 'User successfully deleted';
            res.json({ success: true, message: success });
            console.log(chalk.green(success));
        }
    });
};

/**
 * List of Users
 */
exports.list = function(req, res) {
    console.log(chalk.blue('Listing all users.'));
    User.find(function(err, users) {
        if (err) res.send(err);

        // return the users
        res.json(users);
    });
};
